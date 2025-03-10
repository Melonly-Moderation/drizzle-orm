import type { BatchItem, BatchResponse } from '~/batch.ts';
import { BaseSQLiteDatabase } from '~/sqlite-core/db.ts';
import type { DrizzleConfig } from '~/utils.ts';
export interface SqliteRemoteResult<T = unknown> {
    rows?: T[];
}
export declare class SqliteRemoteDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends BaseSQLiteDatabase<'async', SqliteRemoteResult, TSchema> {
    static readonly [x: number]: string;
    batch<U extends BatchItem<'sqlite'>, T extends Readonly<[U, ...U[]]>>(batch: T): Promise<BatchResponse<T>>;
}
export type AsyncRemoteCallback = (sql: string, params: any[], method: 'run' | 'all' | 'values' | 'get') => Promise<{
    rows: any[];
}>;
export type AsyncBatchRemoteCallback = (batch: {
    sql: string;
    params: any[];
    method: 'run' | 'all' | 'values' | 'get';
}[]) => Promise<{
    rows: any[];
}[]>;
export type RemoteCallback = AsyncRemoteCallback;
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>>(callback: RemoteCallback, config?: DrizzleConfig<TSchema>): SqliteRemoteDatabase<TSchema>;
export declare function drizzle<TSchema extends Record<string, unknown> = Record<string, never>>(callback: RemoteCallback, batchCallback?: AsyncBatchRemoteCallback, config?: DrizzleConfig<TSchema>): SqliteRemoteDatabase<TSchema>;
