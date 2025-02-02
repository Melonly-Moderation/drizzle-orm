import type { MigrationConfig } from '~/migrator.ts';
import type { PgliteDatabase } from './driver.ts';
export declare function migrate<TSchema extends Record<string, unknown>>(db: PgliteDatabase<TSchema>, config: MigrationConfig): Promise<void>;
