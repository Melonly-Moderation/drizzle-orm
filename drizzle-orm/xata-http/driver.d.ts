import type { Logger } from '~/logger.ts';
import { PgDatabase } from '~/pg-core/db.ts';
import { PgDialect } from '~/pg-core/dialect.ts';
import type { RelationalSchemaConfig, TablesRelationalConfig } from '~/relations.ts';
import type { DrizzleConfig } from '~/utils.ts';
import type { XataHttpClient, XataHttpQueryResultHKT } from './session.ts';
import { XataHttpSession } from './session.ts';
export interface XataDriverOptions {
    logger?: Logger;
}
export declare class XataHttpDriver {
    static readonly [x: number]: string;
    private client;
    private dialect;
    private options;
    constructor(client: XataHttpClient, dialect: PgDialect, options?: XataDriverOptions);
    createSession(schema: RelationalSchemaConfig<TablesRelationalConfig> | undefined): XataHttpSession<Record<string, unknown>, TablesRelationalConfig>;
    initMappers(): void;
}
export declare class XataHttpDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends PgDatabase<XataHttpQueryResultHKT, TSchema> {
    static readonly [x: number]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>>(client: XataHttpClient, config?: DrizzleConfig<TSchema>): XataHttpDatabase<TSchema> & {
    $client: XataHttpClient;
};
