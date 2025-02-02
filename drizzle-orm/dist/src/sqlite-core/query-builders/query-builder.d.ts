import { entityKind } from '~/entity.ts';
import type { SQLiteDialectConfig } from '~/sqlite-core/dialect.ts';
import { SQLiteDialect } from '~/sqlite-core/dialect.ts';
import type { WithBuilder } from '~/sqlite-core/subquery.ts';
import { WithSubquery } from '~/subquery.ts';
import { SQLiteSelectBuilder } from './select.ts';
import type { SelectedFields } from './select.types.ts';
export declare class QueryBuilder {
    static readonly [entityKind]: string;
    private dialect;
    private dialectConfig;
    constructor(dialect?: SQLiteDialect | SQLiteDialectConfig);
    $with: WithBuilder;
    with(...queries: WithSubquery[]): {
        select: {
            (): SQLiteSelectBuilder<undefined, "sync", void, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): SQLiteSelectBuilder<TSelection, "sync", void, "qb">;
        };
        selectDistinct: {
            (): SQLiteSelectBuilder<undefined, "sync", void, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): SQLiteSelectBuilder<TSelection, "sync", void, "qb">;
        };
    };
    select(): SQLiteSelectBuilder<undefined, 'sync', void, 'qb'>;
    select<TSelection extends SelectedFields>(fields: TSelection): SQLiteSelectBuilder<TSelection, 'sync', void, 'qb'>;
    selectDistinct(): SQLiteSelectBuilder<undefined, 'sync', void, 'qb'>;
    selectDistinct<TSelection extends SelectedFields>(fields: TSelection): SQLiteSelectBuilder<TSelection, 'sync', void, 'qb'>;
    private getDialect;
}
