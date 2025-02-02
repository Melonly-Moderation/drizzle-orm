import type { MigrationConfig } from '~/migrator.ts';
import type { SqliteRemoteDatabase } from './driver.ts';
export type ProxyMigrator = (migrationQueries: string[]) => Promise<void>;
export declare function migrate<TSchema extends Record<string, unknown>>(db: SqliteRemoteDatabase<TSchema>, callback: ProxyMigrator, config: MigrationConfig): Promise<void>;
