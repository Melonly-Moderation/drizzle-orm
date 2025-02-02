import type { MigrationConfig } from '~/migrator.ts';
import type { PostgresJsDatabase } from './driver.ts';
export declare function migrate<TSchema extends Record<string, unknown>>(db: PostgresJsDatabase<TSchema>, config: MigrationConfig): Promise<void>;
