import { entityKind } from '~/entity.ts';
import { SQL, type SQLWrapper } from '~/sql/sql.ts';
import type { NeonAuthToken } from '~/utils.ts';
import type { PgSession } from '../session.ts';
import type { PgTable } from '../table.ts';
export declare class PgCountBuilder<TSession extends PgSession<any, any, any>> extends SQL<number> implements Promise<number>, SQLWrapper {
    readonly params: {
        source: PgTable | SQL | SQLWrapper;
        filters?: SQL<unknown>;
        session: TSession;
    };
    private sql;
    private token?;
    static readonly [entityKind] = "PgCountBuilder";
    [Symbol.toStringTag]: string;
    private session;
    private static buildEmbeddedCount;
    private static buildCount;
    constructor(params: {
        source: PgTable | SQL | SQLWrapper;
        filters?: SQL<unknown>;
        session: TSession;
    });
    /** @intrnal */
    setToken(token?: NeonAuthToken): this;
    then<TResult1 = number, TResult2 = never>(onfulfilled?: ((value: number) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2>;
    catch(onRejected?: ((reason: any) => any) | null | undefined): Promise<number>;
    finally(onFinally?: (() => void) | null | undefined): Promise<number>;
}
