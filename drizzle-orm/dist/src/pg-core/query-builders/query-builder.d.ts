import { entityKind } from '~/entity.ts';
import type { PgDialectConfig } from '~/pg-core/dialect.ts';
import { PgDialect } from '~/pg-core/dialect.ts';
import type { SQLWrapper } from '~/sql/sql.ts';
import { WithSubquery } from '~/subquery.ts';
import type { PgColumn } from '../columns/index.ts';
import type { WithBuilder } from '../subquery.ts';
import { PgSelectBuilder } from './select.ts';
import type { SelectedFields } from './select.types.ts';
export declare class QueryBuilder {
    static readonly [entityKind]: string;
    private dialect;
    private dialectConfig;
    constructor(dialect?: PgDialect | PgDialectConfig);
    $with: WithBuilder;
    with(...queries: WithSubquery[]): {
        select: {
            (): PgSelectBuilder<undefined, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): PgSelectBuilder<TSelection, "qb">;
        };
        selectDistinct: {
            (): PgSelectBuilder<undefined, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): PgSelectBuilder<TSelection, "qb">;
        };
        selectDistinctOn: {
            (on: (PgColumn | SQLWrapper)[]): PgSelectBuilder<undefined, "qb">;
            <TSelection extends SelectedFields>(on: (PgColumn | SQLWrapper)[], fields: TSelection): PgSelectBuilder<TSelection, "qb">;
        };
    };
    select(): PgSelectBuilder<undefined, 'qb'>;
    select<TSelection extends SelectedFields>(fields: TSelection): PgSelectBuilder<TSelection, 'qb'>;
    selectDistinct(): PgSelectBuilder<undefined>;
    selectDistinct<TSelection extends SelectedFields>(fields: TSelection): PgSelectBuilder<TSelection>;
    selectDistinctOn(on: (PgColumn | SQLWrapper)[]): PgSelectBuilder<undefined>;
    selectDistinctOn<TSelection extends SelectedFields>(on: (PgColumn | SQLWrapper)[], fields: TSelection): PgSelectBuilder<TSelection>;
    private getDialect;
}
