import type { MigrationConfig } from '~/migrator.ts';
import type { LibSQLDatabase } from './driver.ts';
export declare function migrate<TSchema extends Record<string, unknown>>(db: LibSQLDatabase<TSchema>, config: MigrationConfig): Promise<void>;
