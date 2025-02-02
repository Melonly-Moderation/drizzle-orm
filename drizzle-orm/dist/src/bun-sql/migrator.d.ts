import type { MigrationConfig } from '~/migrator.ts';
import type { BunSQLDatabase } from './driver.ts';
export declare function migrate<TSchema extends Record<string, unknown>>(db: BunSQLDatabase<TSchema>, config: MigrationConfig): Promise<void>;
