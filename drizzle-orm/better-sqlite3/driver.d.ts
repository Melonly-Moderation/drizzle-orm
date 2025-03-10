import { type Database, type Options, type RunResult } from 'better-sqlite3';
import { BaseSQLiteDatabase } from '~/sqlite-core/db.ts';
import { type DrizzleConfig } from '~/utils.ts';
export type DrizzleBetterSQLite3DatabaseConfig = ({
    source?: string | Buffer;
} & Options) | string | undefined;
export declare class BetterSQLite3Database<TSchema extends Record<string, unknown> = Record<string, never>> extends BaseSQLiteDatabase<'sync', RunResult, TSchema> {
    static readonly [x: number]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>>(...params: [] | [
    Database | string
] | [
    Database | string,
    DrizzleConfig<TSchema>
] | [
    (DrizzleConfig<TSchema> & ({
        connection?: DrizzleBetterSQLite3DatabaseConfig;
    } | {
        client: Database;
    }))
]): BetterSQLite3Database<TSchema> & {
    $client: Database;
};
export declare namespace drizzle {
    function mock<TSchema extends Record<string, unknown> = Record<string, never>>(config?: DrizzleConfig<TSchema>): BetterSQLite3Database<TSchema> & {
        $client: '$client is not available on drizzle.mock()';
    };
}
