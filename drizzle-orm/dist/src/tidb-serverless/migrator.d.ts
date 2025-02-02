import type { MigrationConfig } from '~/migrator.ts';
import type { TiDBServerlessDatabase } from './driver.ts';
export declare function migrate<TSchema extends Record<string, unknown>>(db: TiDBServerlessDatabase<TSchema>, config: MigrationConfig): Promise<void>;
