import type { MigrationConfig } from '~/migrator.ts';
import type { SingleStoreDriverDatabase } from './driver.ts';
export declare function migrate<TSchema extends Record<string, unknown>>(db: SingleStoreDriverDatabase<TSchema>, config: MigrationConfig): Promise<void>;
