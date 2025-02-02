import type { MigrationConfig } from '~/migrator.ts';
import type { DrizzleD1Database } from './driver.ts';
export declare function migrate<TSchema extends Record<string, unknown>>(db: DrizzleD1Database<TSchema>, config: MigrationConfig): Promise<void>;
