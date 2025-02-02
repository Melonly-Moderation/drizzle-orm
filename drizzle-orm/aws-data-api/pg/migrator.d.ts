import type { MigrationConfig } from '~/migrator.ts';
import type { AwsDataApiPgDatabase } from './driver.ts';
export declare function migrate<TSchema extends Record<string, unknown>>(db: AwsDataApiPgDatabase<TSchema>, config: MigrationConfig): Promise<void>;
