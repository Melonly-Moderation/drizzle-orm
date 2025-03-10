import { type Pool, type PoolConfig } from 'pg';
import type { Logger } from '~/logger.ts';
import { PgDatabase } from '~/pg-core/db.ts';
import { PgDialect } from '~/pg-core/dialect.ts';
import { type RelationalSchemaConfig, type TablesRelationalConfig } from '~/relations.ts';
import { type DrizzleConfig } from '~/utils.ts';
import type { NodePgClient, NodePgQueryResultHKT } from './session.ts';
import { NodePgSession } from './session.ts';
export interface PgDriverOptions {
    logger?: Logger;
}
export declare class NodePgDriver {
    static readonly [x: number]: string;
    private client;
    private dialect;
    private options;
    constructor(client: NodePgClient, dialect: PgDialect, options?: PgDriverOptions);
    createSession(schema: RelationalSchemaConfig<TablesRelationalConfig> | undefined): NodePgSession<Record<string, unknown>, TablesRelationalConfig>;
}
export declare class NodePgDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends PgDatabase<NodePgQueryResultHKT, TSchema> {
    static readonly [x: number]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends NodePgClient = Pool>(...params: [
    TClient | string
] | [
    TClient | string,
    DrizzleConfig<TSchema>
] | [
    (DrizzleConfig<TSchema> & ({
        connection: string | PoolConfig;
    } | {
        client: TClient;
    }))
]): NodePgDatabase<TSchema> & {
    $client: TClient;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): NodePgDatabase<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
