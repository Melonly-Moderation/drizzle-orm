import { entityKind } from './entity.ts';
import { View } from './sql/sql.ts';
import { Subquery } from './subquery.ts';
export declare class SelectionProxyHandler<T extends Subquery | Record<string, unknown> | View> implements ProxyHandler<Subquery | Record<string, unknown> | View> {
    static readonly [entityKind]: string;
    private config;
    constructor(config: SelectionProxyHandler<T>['config']);
    get(subquery: T, prop: string | symbol): any;
}
