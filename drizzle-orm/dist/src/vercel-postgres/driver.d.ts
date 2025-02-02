import { sql } from '@vercel/postgres';
import { entityKind } from '~/entity.ts';
import type { Logger } from '~/logger.ts';
import { PgDatabase } from '~/pg-core/db.ts';
import { PgDialect } from '~/pg-core/index.ts';
import { type RelationalSchemaConfig, type TablesRelationalConfig } from '~/relations.ts';
import { type DrizzleConfig } from '~/utils.ts';
import { type VercelPgClient, type VercelPgQueryResultHKT, VercelPgSession } from './session.ts';
export interface VercelPgDriverOptions {
    logger?: Logger;
}
export declare class VercelPgDriver {
    private client;
    private dialect;
    private options;
    static readonly [entityKind]: string;
    constructor(client: VercelPgClient, dialect: PgDialect, options?: VercelPgDriverOptions);
    createSession(schema: RelationalSchemaConfig<TablesRelationalConfig> | undefined): VercelPgSession<Record<string, unknown>, TablesRelationalConfig>;
}
export declare class VercelPgDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends PgDatabase<VercelPgQueryResultHKT, TSchema> {
    static readonly [entityKind]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends VercelPgClient = typeof sql>(...params: [] | [
    TClient
] | [
    TClient,
    DrizzleConfig<TSchema>
] | [
    (DrizzleConfig<TSchema> & ({
        client?: TClient;
    }))
]): VercelPgDatabase<TSchema> & {
    $client: TClient;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): VercelPgDatabase<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
