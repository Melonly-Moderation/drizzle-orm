import { type Connection as CallbackConnection, type Pool as CallbackPool, type PoolOptions } from 'mysql2';
import type { Connection, Pool } from 'mysql2/promise';
import { entityKind } from '~/entity.ts';
import type { Logger } from '~/logger.ts';
import { MySqlDatabase } from '~/mysql-core/db.ts';
import { MySqlDialect } from '~/mysql-core/dialect.ts';
import type { Mode } from '~/mysql-core/session.ts';
import { type RelationalSchemaConfig, type TablesRelationalConfig } from '~/relations.ts';
import { type DrizzleConfig } from '~/utils.ts';
import type { MySql2Client, MySql2PreparedQueryHKT, MySql2QueryResultHKT } from './session.ts';
import { MySql2Session } from './session.ts';
export interface MySqlDriverOptions {
    logger?: Logger;
}
export declare class MySql2Driver {
    private client;
    private dialect;
    private options;
    static readonly [entityKind]: string;
    constructor(client: MySql2Client, dialect: MySqlDialect, options?: MySqlDriverOptions);
    createSession(schema: RelationalSchemaConfig<TablesRelationalConfig> | undefined, mode: Mode): MySql2Session<Record<string, unknown>, TablesRelationalConfig>;
}
export { MySqlDatabase } from '~/mysql-core/db.ts';
export declare class MySql2Database<TSchema extends Record<string, unknown> = Record<string, never>> extends MySqlDatabase<MySql2QueryResultHKT, MySql2PreparedQueryHKT, TSchema> {
    static readonly [entityKind]: string;
}
export type MySql2DrizzleConfig<TSchema extends Record<string, unknown> = Record<string, never>> = Omit<DrizzleConfig<TSchema>, 'schema'> & ({
    schema: TSchema;
    mode: Mode;
} | {
    schema?: undefined;
    mode?: Mode;
});
export type AnyMySql2Connection = Pool | Connection | CallbackPool | CallbackConnection;
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends AnyMySql2Connection = CallbackPool>(...params: [
    TClient | string
] | [
    TClient | string,
    MySql2DrizzleConfig<TSchema>
] | [
    (MySql2DrizzleConfig<TSchema> & ({
        connection: string | PoolOptions;
    } | {
        client: TClient;
    }))
]): MySql2Database<TSchema> & {
    $client: TClient;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: MySql2DrizzleConfig<TSchema>): MySql2Database<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
