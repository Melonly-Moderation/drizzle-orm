import { Pool, type PoolConfig } from '@neondatabase/serverless';
import type { Logger } from '~/logger.ts';
import { PgDatabase } from '~/pg-core/db.ts';
import { PgDialect } from '~/pg-core/dialect.ts';
import { type RelationalSchemaConfig, type TablesRelationalConfig } from '~/relations.ts';
import { type DrizzleConfig } from '~/utils.ts';
import type { NeonClient, NeonQueryResultHKT } from './session.ts';
import { NeonSession } from './session.ts';
export interface NeonDriverOptions {
    logger?: Logger;
}
export declare class NeonDriver {
    static readonly [x: number]: string;
    private client;
    private dialect;
    private options;
    constructor(client: NeonClient, dialect: PgDialect, options?: NeonDriverOptions);
    createSession(schema: RelationalSchemaConfig<TablesRelationalConfig> | undefined): NeonSession<Record<string, unknown>, TablesRelationalConfig>;
}
export declare class NeonDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends PgDatabase<NeonQueryResultHKT, TSchema> {
    static readonly [x: number]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends NeonClient = Pool>(...params: [
    TClient | string
] | [
    TClient | string,
    DrizzleConfig<TSchema>
] | [
    (DrizzleConfig<TSchema> & ({
        connection: string | PoolConfig;
    } | {
        client: TClient;
    }) & {
        ws?: any;
    })
]): NeonDatabase<TSchema> & {
    $client: TClient;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): NeonDatabase<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
