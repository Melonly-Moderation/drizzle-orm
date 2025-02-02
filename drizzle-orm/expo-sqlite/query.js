import { addDatabaseChangeListener } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { is } from '~/entity.ts';
import { SQL } from '~/sql/sql.ts';
import { getTableConfig, getViewConfig, SQLiteTable, SQLiteView } from '~/sqlite-core/index.ts';
import { SQLiteRelationalQuery } from '~/sqlite-core/query-builders/query.ts';
import { Subquery } from '~/subquery.ts';
export const useLiveQuery = (query, deps = []) => {
    const [data, setData] = useState((is(query, SQLiteRelationalQuery) && query.mode === 'first' ? undefined : []));
    const [error, setError] = useState();
    const [updatedAt, setUpdatedAt] = useState();
    useEffect(() => {
        const entity = is(query, SQLiteRelationalQuery) ? query.table : query.config.table;
        if (is(entity, Subquery) || is(entity, SQL)) {
            setError(new Error('Selecting from subqueries and SQL are not supported in useLiveQuery'));
            return;
        }
        let listener;
        const handleData = (data) => {
            setData(data);
            setUpdatedAt(new Date());
        };
        query.then(handleData).catch(setError);
        if (is(entity, SQLiteTable) || is(entity, SQLiteView)) {
            const config = is(entity, SQLiteTable) ? getTableConfig(entity) : getViewConfig(entity);
            listener = addDatabaseChangeListener(({ tableName }) => {
                if (config.name === tableName) {
                    query.then(handleData).catch(setError);
                }
            });
        }
        return () => {
            listener?.remove();
        };
    }, deps);
    return {
        data,
        error,
        updatedAt,
    };
};
//# sourceMappingURL=query.js.map