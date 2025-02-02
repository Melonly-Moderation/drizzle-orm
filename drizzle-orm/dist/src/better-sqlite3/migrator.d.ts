import type { MigrationConfig } from '~/migrator.ts';
import type { BetterSQLite3Database } from './driver.ts';
export declare function migrate<TSchema extends Record<string, unknown>>(db: BetterSQLite3Database<TSchema>, config: MigrationConfig): void;
