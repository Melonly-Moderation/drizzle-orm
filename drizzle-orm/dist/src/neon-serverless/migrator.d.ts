import type { MigrationConfig } from '~/migrator.ts';
import type { NeonDatabase } from './driver.ts';
export declare function migrate<TSchema extends Record<string, unknown>>(db: NeonDatabase<TSchema>, config: MigrationConfig): Promise<void>;
