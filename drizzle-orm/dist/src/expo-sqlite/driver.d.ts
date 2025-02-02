import type { SQLiteDatabase, SQLiteRunResult } from 'expo-sqlite';
import { entityKind } from '~/entity.ts';
import { BaseSQLiteDatabase } from '~/sqlite-core/db.ts';
import type { DrizzleConfig } from '~/utils.ts';
export declare class ExpoSQLiteDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends BaseSQLiteDatabase<'sync', SQLiteRunResult, TSchema> {
    static readonly [entityKind]: string;
}
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>>(client: SQLiteDatabase, config?: DrizzleConfig<TSchema>): ExpoSQLiteDatabase<TSchema> & {
    $client: SQLiteDatabase;
};
