import type { MigrationConfig } from '~/migrator.ts';
import type { NodePgDatabase } from './driver.ts';
export declare function migrate<TSchema extends Record<string, unknown>>(db: NodePgDatabase<TSchema>, config: MigrationConfig): Promise<void>;
