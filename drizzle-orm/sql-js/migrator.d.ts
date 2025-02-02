import type { MigrationConfig } from '~/migrator.ts';
import type { SQLJsDatabase } from './driver.ts';
export declare function migrate<TSchema extends Record<string, unknown>>(db: SQLJsDatabase<TSchema>, config: MigrationConfig): void;
