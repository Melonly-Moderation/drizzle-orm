import type { MigrationConfig } from '~/migrator.ts';
import type { VercelPgDatabase } from './driver.ts';
export declare function migrate<TSchema extends Record<string, unknown>>(db: VercelPgDatabase<TSchema>, config: MigrationConfig): Promise<void>;
