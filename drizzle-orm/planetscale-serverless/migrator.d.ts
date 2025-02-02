import type { MigrationConfig } from '~/migrator.ts';
import type { PlanetScaleDatabase } from './driver.ts';
export declare function migrate<TSchema extends Record<string, unknown>>(db: PlanetScaleDatabase<TSchema>, config: MigrationConfig): Promise<void>;
