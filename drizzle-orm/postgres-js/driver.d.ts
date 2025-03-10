import { type Options, type PostgresType, type Sql } from 'postgres';
import { PgDatabase } from '~/pg-core/db.ts';
import { type DrizzleConfig } from '~/utils.ts';
import type { PostgresJsQueryResultHKT } from './session.ts';
export declare class PostgresJsDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends PgDatabase<PostgresJsQueryResultHKT, TSchema> {
    static readonly [x: number]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>, TClient extends Sql = Sql>(...params: [
    TClient | string
] | [
    TClient | string,
    DrizzleConfig<TSchema>
] | [
    (DrizzleConfig<TSchema> & ({
        connection: string | ({
            url?: string;
        } & Options<Record<string, PostgresType>>);
    } | {
        client: TClient;
    }))
]): PostgresJsDatabase<TSchema> & {
    $client: TClient;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): PostgresJsDatabase<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
