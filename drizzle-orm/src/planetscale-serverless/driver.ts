import type { Config, Connection } from '@planetscale/database';
import { Client } from '@planetscale/database';
import { entityKind } from '~/entity.ts';
import type { Logger } from '~/logger.ts';
import { DefaultLogger } from '~/logger.ts';
import { MySqlDatabase } from '~/mysql-core/db.ts';
import { MySqlDialect } from '~/mysql-core/dialect.ts';
import {
	createTableRelationsHelpers,
	extractTablesRelationalConfig,
	type RelationalSchemaConfig,
	type TablesRelationalConfig,
} from '~/relations.ts';
import type { DrizzleConfig, IfNotImported, ImportTypeError } from '~/utils.ts';
import type { PlanetScalePreparedQueryHKT, PlanetscaleQueryResultHKT } from './session.ts';
import { PlanetscaleSession } from './session.ts';

export interface PlanetscaleSDriverOptions {
	logger?: Logger;
}

export class PlanetScaleDatabase<
	TSchema extends Record<string, unknown> = Record<string, never>,
> extends MySqlDatabase<PlanetscaleQueryResultHKT, PlanetScalePreparedQueryHKT, TSchema> {
	static override readonly [entityKind]: string = 'PlanetScaleDatabase';
}

function construct<
	TSchema extends Record<string, unknown> = Record<string, never>,
	TClient extends Client | Connection = Client | Connection,
>(
	client: TClient,
	config: DrizzleConfig<TSchema> = {},
): PlanetScaleDatabase<TSchema> & {
	$client: TClient;
} {
	// Client is not Drizzle Object, so we can ignore this rule here
	// eslint-disable-next-line no-instanceof/no-instanceof
	if (!(client instanceof Client)) {
		// Should use error on 0.30.0 release
		// 		throw new DrizzleError({
		// 			message: `You need to pass an instance of Client:

		// import { Client } from "@planetscale/database";

		// const client = new Client({
		//   host: process.env["DATABASE_HOST"],
		//   username: process.env["DATABASE_USERNAME"],
		//   password: process.env["DATABASE_PASSWORD"],
		// });

		// const db = drizzle(client);
		// `,
		// 		});
		console.log(`Warning: You need to pass an instance of Client:

import { Client } from "@planetscale/database";

const client = new Client({
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
});

const db = drizzle(client);
		
Starting from version 0.30.0, you will encounter an error if you attempt to use anything other than a Client instance.\nPlease make the necessary changes now to prevent any runtime errors in the future
		`);
	}

	const dialect = new MySqlDialect({ casing: config.casing });
	let logger;
	if (config.logger === true) {
		logger = new DefaultLogger();
	} else if (config.logger !== false) {
		logger = config.logger;
	}

	let schema: RelationalSchemaConfig<TablesRelationalConfig> | undefined;
	if (config.schema) {
		const tablesConfig = extractTablesRelationalConfig(
			config.schema,
			createTableRelationsHelpers,
		);
		schema = {
			fullSchema: config.schema,
			schema: tablesConfig.tables,
			tableNamesMap: tablesConfig.tableNamesMap,
		};
	}

	const session = new PlanetscaleSession(client, dialect, undefined, schema, { logger });
	const db = new PlanetScaleDatabase(dialect, session, schema as any, 'planetscale') as PlanetScaleDatabase<TSchema>;
	(<any> db).$client = client;

	return db as any;
}

export function drizzle<
	TSchema extends Record<string, unknown> = Record<string, never>,
	TClient extends Client = Client,
>(
	...params: IfNotImported<
		Config,
		[ImportTypeError<'@planetscale/database'>],
		[
			TClient | string,
		] | [
			TClient | string,
			DrizzleConfig<TSchema>,
		] | [
			(
				& DrizzleConfig<TSchema>
				& ({
					connection: string | Config;
				})
			),
		]
	>
): PlanetScaleDatabase<TSchema> & {
	$client: TClient;
} {
	// eslint-disable-next-line no-instanceof/no-instanceof
	if (params[0] instanceof Client) {
		return construct(params[0] as TClient, params[1] as DrizzleConfig<TSchema> | undefined) as any;
	}

	if (typeof params[0] === 'object') {
		const { connection, ...drizzleConfig } = params[0] as
			& { connection: Config | string }
			& DrizzleConfig;

		const instance = typeof connection === 'string'
			? new Client({
				url: connection,
			})
			: new Client(
				connection,
			);

		return construct(instance, drizzleConfig) as any;
	}

	const instance = new Client({
		url: params[0],
	});

	return construct(instance, params[1]) as any;
}
