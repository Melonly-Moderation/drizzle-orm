import type { ColumnMetadata, ExecuteStatementCommandOutput, Field, RDSDataClient } from '@aws-sdk/client-rds-data';
import {
	BeginTransactionCommand,
	CommitTransactionCommand,
	ExecuteStatementCommand,
	RollbackTransactionCommand,
} from '@aws-sdk/client-rds-data';
import { entityKind } from '~/entity.ts';
import type { Logger } from '~/logger.ts';
import {
	type PgDialect,
	PgPreparedQuery,
	PgSession,
	PgTransaction,
	type PgTransactionConfig,
	type PreparedQueryConfig,
	type QueryResultHKT,
} from '~/pg-core/index.ts';
import type { SelectedFieldsOrdered } from '~/pg-core/query-builders/select.types.ts';
import type { RelationalSchemaConfig, TablesRelationalConfig } from '~/relations.ts';
import { fillPlaceholders, type QueryTypingsValue, type QueryWithTypings, type SQL, sql } from '~/sql/sql.ts';
import { mapResultRow } from '~/utils.ts';
import { getValueFromDataApi, toValueParam } from '../common/index.ts';

export type AwsDataApiClient = RDSDataClient;

export class AwsDataApiPreparedQuery<T extends PreparedQueryConfig> extends PgPreparedQuery<T> {
	static readonly [entityKind]: string = 'AwsDataApiPreparedQuery';

	private rawQuery: ExecuteStatementCommand;

	constructor(
		private client: AwsDataApiClient,
		queryString: string,
		private params: unknown[],
		private typings: QueryTypingsValue[],
		private options: AwsDataApiSessionOptions,
		private fields: SelectedFieldsOrdered | undefined,
		/** @internal */
		readonly transactionId: string | undefined,
		private customResultMapper?: (rows: unknown[][]) => T['execute'],
	) {
		super({ sql: queryString, params });
		this.rawQuery = new ExecuteStatementCommand({
			sql: queryString,
			parameters: [],
			secretArn: options.secretArn,
			resourceArn: options.resourceArn,
			database: options.database,
			transactionId,
			includeResultMetadata: !fields && !customResultMapper,
		});
	}

	async execute(placeholderValues: Record<string, unknown> | undefined = {}): Promise<T['execute']> {
		const { fields, joinsNotNullableMap, customResultMapper } = this;

		const rows = await this.values(placeholderValues) as unknown[][];
		if (!fields && !customResultMapper) {
			return rows as T['execute'];
		}
		return customResultMapper
			? customResultMapper(rows)
			: rows.map((row) => mapResultRow<T['execute']>(fields!, row, joinsNotNullableMap));
	}

	all(placeholderValues?: Record<string, unknown> | undefined): Promise<T['all']> {
		return this.execute(placeholderValues);
	}

	async values(placeholderValues: Record<string, unknown> = {}): Promise<T['values']> {
		const params = fillPlaceholders(this.params, placeholderValues ?? {});

		this.rawQuery.input.parameters = params.map((param, index) => ({
			name: `${index + 1}`,
			...toValueParam(param, this.typings[index]),
		}));

		this.options.logger?.logQuery(this.rawQuery.input.sql!, this.rawQuery.input.parameters);

		const { fields, rawQuery, client, customResultMapper } = this;
		if (!fields && !customResultMapper) {
			const result = await client.send(rawQuery);
			if (result.columnMetadata && result.columnMetadata.length > 0) {
				return this.mapResultRows(result.records ?? [], result.columnMetadata);
			}
			return result.records ?? [];
		}

		const result = await client.send(rawQuery);

		return result.records?.map((row: any) => {
			return row.map((field: Field) => getValueFromDataApi(field));
		});
	}

	/** @internal */
	mapResultRows(records: Field[][], columnMetadata: ColumnMetadata[]) {
		return records.map((record) => {
			const row: Record<string, unknown> = {};
			for (const [index, field] of record.entries()) {
				const { name } = columnMetadata[index]!;
				row[name ?? index] = getValueFromDataApi(field); // not what to default if name is undefined
			}
			return row;
		});
	}
}

export interface AwsDataApiSessionOptions {
	logger?: Logger;
	database: string;
	resourceArn: string;
	secretArn: string;
}

interface AwsDataApiQueryBase {
	resourceArn: string;
	secretArn: string;
	database: string;
}

export class AwsDataApiSession<
	TFullSchema extends Record<string, unknown>,
	TSchema extends TablesRelationalConfig,
> extends PgSession<AwsDataApiPgQueryResultHKT, TFullSchema, TSchema> {
	static readonly [entityKind]: string = 'AwsDataApiSession';

	/** @internal */
	readonly rawQuery: AwsDataApiQueryBase;

	constructor(
		/** @internal */
		readonly client: AwsDataApiClient,
		dialect: PgDialect,
		private schema: RelationalSchemaConfig<TSchema> | undefined,
		private options: AwsDataApiSessionOptions,
		/** @internal */
		readonly transactionId: string | undefined,
	) {
		super(dialect);
		this.rawQuery = {
			secretArn: options.secretArn,
			resourceArn: options.resourceArn,
			database: options.database,
		};
	}

	prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(
		query: QueryWithTypings,
		fields: SelectedFieldsOrdered | undefined,
		transactionId?: string,
		customResultMapper?: (rows: unknown[][]) => T['execute'],
	): PgPreparedQuery<T> {
		return new AwsDataApiPreparedQuery(
			this.client,
			query.sql,
			query.params,
			query.typings ?? [],
			this.options,
			fields,
			transactionId,
			customResultMapper,
		);
	}

	override execute<T>(query: SQL): Promise<T> {
		return this.prepareQuery<PreparedQueryConfig & { execute: T }>(
			this.dialect.sqlToQuery(query),
			undefined,
			this.transactionId,
		).execute();
	}

	override async transaction<T>(
		transaction: (tx: AwsDataApiTransaction<TFullSchema, TSchema>) => Promise<T>,
		config?: PgTransactionConfig | undefined,
	): Promise<T> {
		const { transactionId } = await this.client.send(new BeginTransactionCommand(this.rawQuery));
		const session = new AwsDataApiSession(this.client, this.dialect, this.schema, this.options, transactionId);
		const tx = new AwsDataApiTransaction(this.dialect, session, this.schema);
		if (config) {
			await tx.setTransaction(config);
		}
		try {
			const result = await transaction(tx);
			await this.client.send(new CommitTransactionCommand({ ...this.rawQuery, transactionId }));
			return result;
		} catch (e) {
			await this.client.send(new RollbackTransactionCommand({ ...this.rawQuery, transactionId }));
			throw e;
		}
	}
}

export class AwsDataApiTransaction<
	TFullSchema extends Record<string, unknown>,
	TSchema extends TablesRelationalConfig,
> extends PgTransaction<AwsDataApiPgQueryResultHKT, TFullSchema, TSchema> {
	static readonly [entityKind]: string = 'AwsDataApiTransaction';

	override async transaction<T>(transaction: (tx: AwsDataApiTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T> {
		const savepointName = `sp${this.nestedIndex + 1}`;
		const tx = new AwsDataApiTransaction(this.dialect, this.session, this.schema, this.nestedIndex + 1);
		await this.session.execute(sql.raw(`savepoint ${savepointName}`));
		try {
			const result = await transaction(tx);
			await this.session.execute(sql.raw(`release savepoint ${savepointName}`));
			return result;
		} catch (e) {
			await this.session.execute(sql.raw(`rollback to savepoint ${savepointName}`));
			throw e;
		}
	}
}

export interface AwsDataApiPgQueryResultHKT extends QueryResultHKT {
	type: ExecuteStatementCommandOutput;
}
