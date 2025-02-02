import { entityKind } from '~/entity.ts';
import type { MySqlDialectConfig } from '~/mysql-core/dialect.ts';
import { MySqlDialect } from '~/mysql-core/dialect.ts';
import type { WithBuilder } from '~/mysql-core/subquery.ts';
import { WithSubquery } from '~/subquery.ts';
import { MySqlSelectBuilder } from './select.ts';
import type { SelectedFields } from './select.types.ts';
export declare class QueryBuilder {
    static readonly [entityKind]: string;
    private dialect;
    private dialectConfig;
    constructor(dialect?: MySqlDialect | MySqlDialectConfig);
    $with: WithBuilder;
    with(...queries: WithSubquery[]): {
        select: {
            (): MySqlSelectBuilder<undefined, never, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): MySqlSelectBuilder<TSelection, never, "qb">;
        };
        selectDistinct: {
            (): MySqlSelectBuilder<undefined, never, "qb">;
            <TSelection extends SelectedFields>(fields: TSelection): MySqlSelectBuilder<TSelection, never, "qb">;
        };
    };
    select(): MySqlSelectBuilder<undefined, never, 'qb'>;
    select<TSelection extends SelectedFields>(fields: TSelection): MySqlSelectBuilder<TSelection, never, 'qb'>;
    selectDistinct(): MySqlSelectBuilder<undefined, never, 'qb'>;
    selectDistinct<TSelection extends SelectedFields>(fields: TSelection): MySqlSelectBuilder<TSelection, never, 'qb'>;
    private getDialect;
}
