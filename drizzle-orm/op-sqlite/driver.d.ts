import type { OPSQLiteConnection, QueryResult } from '@op-engineering/op-sqlite';
import { BaseSQLiteDatabase } from '~/sqlite-core/db.ts';
import type { DrizzleConfig } from '~/utils.ts';
export declare class OPSQLiteDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends BaseSQLiteDatabase<'async', QueryResult, TSchema> {
    static readonly [x: number]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>>(client: OPSQLiteConnection, config?: DrizzleConfig<TSchema>): OPSQLiteDatabase<TSchema> & {
    $client: OPSQLiteConnection;
};
