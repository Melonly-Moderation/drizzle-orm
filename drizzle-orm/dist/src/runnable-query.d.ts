import type { Dialect } from './column-builder.ts';
export interface RunnableQuery<T, TDialect extends Dialect> {
    readonly _: {
        readonly dialect: TDialect;
        readonly result: T;
    };
}
