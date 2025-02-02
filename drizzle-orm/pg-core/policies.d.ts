import type { SQL } from '~/sql/sql.ts';
import type { PgRole } from './roles.ts';
import type { PgTable } from './table.ts';
export type PgPolicyToOption = 'public' | 'current_role' | 'current_user' | 'session_user' | (string & {}) | PgPolicyToOption[] | PgRole;
export interface PgPolicyConfig {
    as?: 'permissive' | 'restrictive';
    for?: 'all' | 'select' | 'insert' | 'update' | 'delete';
    to?: PgPolicyToOption;
    using?: SQL;
    withCheck?: SQL;
}
export declare class PgPolicy implements PgPolicyConfig {
    static readonly [x: number]: string;
    readonly name: string;
    readonly as: PgPolicyConfig['as'];
    readonly for: PgPolicyConfig['for'];
    readonly to: PgPolicyConfig['to'];
    readonly using: PgPolicyConfig['using'];
    readonly withCheck: PgPolicyConfig['withCheck'];
    constructor(name: string, config?: PgPolicyConfig);
    link(table: PgTable): this;
}
export declare function pgPolicy(name: string, config?: PgPolicyConfig): PgPolicy;
