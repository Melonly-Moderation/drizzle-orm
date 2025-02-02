import type { MigrationConfig } from '~/migrator.ts';
import type { MySqlRemoteDatabase } from './driver.ts';
export type ProxyMigrator = (migrationQueries: string[]) => Promise<void>;
export declare function migrate<TSchema extends Record<string, unknown>>(db: MySqlRemoteDatabase<TSchema>, callback: ProxyMigrator, config: MigrationConfig): Promise<void>;
