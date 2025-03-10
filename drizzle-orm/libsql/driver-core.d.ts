import type { ResultSet } from '@libsql/client';
import type { BatchItem, BatchResponse } from '~/batch.ts';
import { BaseSQLiteDatabase } from '~/sqlite-core/db.ts';
export declare class LibSQLDatabase<TSchema extends Record<string, unknown> = Record<string, never>> extends BaseSQLiteDatabase<'async', ResultSet, TSchema> {
    static readonly [x: number]: string;
    batch<U extends BatchItem<'sqlite'>, T extends Readonly<[U, ...U[]]>>(batch: T): Promise<BatchResponse<T>>;
}
