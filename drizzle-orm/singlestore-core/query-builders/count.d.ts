import { SQL, type SQLWrapper } from '~/sql/sql.ts';
import type { SingleStoreSession } from '../session.ts';
import type { SingleStoreTable } from '../table.ts';
export declare class SingleStoreCountBuilder<TSession extends SingleStoreSession<any, any, any>> extends SQL<number> implements Promise<number>, SQLWrapper {
    static readonly [x: number]: "SingleStoreCountBuilder";
    readonly params: {
        source: SingleStoreTable | /* SingleStoreViewBase | */ SQL | SQLWrapper;
        filters?: SQL<unknown>;
        session: TSession;
    };
    private sql;
    [Symbol.toStringTag]: string;
    private session;
    private static buildEmbeddedCount;
    private static buildCount;
    constructor(params: {
        source: SingleStoreTable | /* SingleStoreViewBase | */ SQL | SQLWrapper;
        filters?: SQL<unknown>;
        session: TSession;
    });
    then<TResult1 = number, TResult2 = never>(onfulfilled?: ((value: number) => TResult1 | PromiseLike<TResult1>) | null | undefined, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined): Promise<TResult1 | TResult2>;
    catch(onRejected?: ((reason: any) => never | PromiseLike<never>) | null | undefined): Promise<number>;
    finally(onFinally?: (() => void) | null | undefined): Promise<number>;
}
