import type { MigrationConfig } from '~/migrator.ts';
import type { BunSQLiteDatabase } from './driver.ts';
export declare function migrate<TSchema extends Record<string, unknown>>(db: BunSQLiteDatabase<TSchema>, config: MigrationConfig): void;
