export interface PgRoleConfig {
    createDb?: boolean;
    createRole?: boolean;
    inherit?: boolean;
}
export declare class PgRole implements PgRoleConfig {
    static readonly [x: number]: string;
    readonly name: string;
    constructor(name: string, config?: PgRoleConfig);
    existing(): this;
}
export declare function pgRole(name: string, config?: PgRoleConfig): PgRole;
