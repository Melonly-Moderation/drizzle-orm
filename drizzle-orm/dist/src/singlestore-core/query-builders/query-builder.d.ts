import { entityKind } from '~/entity.ts';
import type { SingleStoreDialectConfig } from '~/singlestore-core/dialect.ts';
import { SingleStoreDialect } from '~/singlestore-core/dialect.ts';
import type { WithBuilder } from '~/singlestore-core/subquery.ts';
import { WithSubquery } from '~/subquery.ts';
import { SingleStoreSelectBuilder } from './select.ts';
import type { SelectedFields } from './select.types.ts';
export declare class QueryBuilder {
    static readonly [entityKind]: string;
    private dialect;
    private dialectConfig;
    constructor(dialect?: SingleStoreDialect | SingleStoreDialectConfig);
    $with: WithBuilder;
    with(...queries: WithSubquery[]): {
        select: {
            (): SingleStoreSelectBuilder<undefined, never, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, never, "qb">;
        };
        selectDistinct: {
            (): SingleStoreSelectBuilder<undefined, never, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, never, "qb">;
        };
    };
    select(): SingleStoreSelectBuilder<undefined, never, 'qb'>;
    select<TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, never, 'qb'>;
    selectDistinct(): SingleStoreSelectBuilder<undefined, never, 'qb'>;
    selectDistinct<TSelection extends SelectedFields>(fields: TSelection): SingleStoreSelectBuilder<TSelection, never, 'qb'>;
    private getDialect;
}
