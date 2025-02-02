import type { PrismaClient } from '@prisma/client/extension';
import type { Logger } from '~/logger.ts';
import { PgDatabase } from '~/pg-core/index.ts';
import type { DrizzleConfig } from '~/utils.ts';
import type { PrismaPgQueryResultHKT } from './session.ts';
export declare class PrismaPgDatabase extends PgDatabase<PrismaPgQueryResultHKT, Record<string, never>> {
    static readonly [x: number]: string;
    constructor(client: PrismaClient, logger: Logger | undefined);
}
export type PrismaPgConfig = Omit<DrizzleConfig, 'schema'>;
export declare function drizzle(config?: PrismaPgConfig): (client: any) => import("@prisma/client").PrismaClientExtends<import("@prisma/client/runtime/library").InternalArgs<{}, {}, {}, {
    $drizzle: PrismaPgDatabase;
}> & import("@prisma/client/runtime/library").DefaultArgs>;
