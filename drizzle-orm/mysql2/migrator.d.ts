import type { MigrationConfig } from '~/migrator.ts';
import type { MySql2Database } from './driver.ts';
export declare function migrate<TSchema extends Record<string, unknown>>(db: MySql2Database<TSchema>, config: MigrationConfig): Promise<void>;
