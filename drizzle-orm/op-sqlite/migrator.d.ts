import type { OPSQLiteDatabase } from './driver.ts';
interface MigrationConfig {
    journal: {
        entries: {
            idx: number;
            when: number;
            tag: string;
            breakpoints: boolean;
        }[];
    };
    migrations: Record<string, string>;
}
export declare function migrate<TSchema extends Record<string, unknown>>(db: OPSQLiteDatabase<TSchema>, config: MigrationConfig): Promise<any>;
interface State {
    success: boolean;
    error?: Error;
}
export declare const useMigrations: (db: OPSQLiteDatabase<any>, migrations: {
    journal: {
        entries: {
            idx: number;
            when: number;
            tag: string;
            breakpoints: boolean;
        }[];
    };
    migrations: Record<string, string>;
}) => State;
export {};
