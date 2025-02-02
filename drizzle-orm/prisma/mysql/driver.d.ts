import type { PrismaClient } from '@prisma/client/extension';
import type { Logger } from '~/logger.ts';
import { MySqlDatabase } from '~/mysql-core/index.ts';
import type { DrizzleConfig } from '~/utils.ts';
import type { PrismaMySqlPreparedQueryHKT, PrismaMySqlQueryResultHKT } from './session.ts';
export declare class PrismaMySqlDatabase extends MySqlDatabase<PrismaMySqlQueryResultHKT, PrismaMySqlPreparedQueryHKT, Record<string, never>> {
    static readonly [x: number]: string;
    constructor(client: PrismaClient, logger: Logger | undefined);
}
export type PrismaMySqlConfig = Omit<DrizzleConfig, 'schema'>;
export declare function drizzle(config?: PrismaMySqlConfig): (client: any) => import("@prisma/client").PrismaClientExtends<import("@prisma/client/runtime/library").InternalArgs<{}, {}, {}, {
    $drizzle: PrismaMySqlDatabase;
}> & import("@prisma/client/runtime/library").DefaultArgs>;
