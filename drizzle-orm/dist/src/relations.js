import { getTableUniqueName, Table } from '~/table.ts';
import { Column } from './column.ts';
import { entityKind, is } from './entity.ts';
import { PrimaryKeyBuilder } from './pg-core/primary-keys.ts';
import { and, asc, between, desc, eq, exists, gt, gte, ilike, inArray, isNotNull, isNull, like, lt, lte, ne, not, notBetween, notExists, notIlike, notInArray, notLike, or, } from './sql/expressions/index.ts';
import { SQL, sql } from './sql/sql.ts';
export class Relation {
    sourceTable;
    referencedTable;
    relationName;
    static [entityKind] = 'Relation';
    referencedTableName;
    fieldName;
    constructor(sourceTable, referencedTable, relationName) {
        this.sourceTable = sourceTable;
        this.referencedTable = referencedTable;
        this.relationName = relationName;
        this.referencedTableName = referencedTable[Table.Symbol.Name];
    }
}
export class Relations {
    table;
    config;
    static [entityKind] = 'Relations';
    constructor(table, config) {
        this.table = table;
        this.config = config;
    }
}
export class One extends Relation {
    config;
    isNullable;
    static [entityKind] = 'One';
    constructor(sourceTable, referencedTable, config, isNullable) {
        super(sourceTable, referencedTable, config?.relationName);
        this.config = config;
        this.isNullable = isNullable;
    }
    withFieldName(fieldName) {
        const relation = new One(this.sourceTable, this.referencedTable, this.config, this.isNullable);
        relation.fieldName = fieldName;
        return relation;
    }
}
export class Many extends Relation {
    config;
    static [entityKind] = 'Many';
    constructor(sourceTable, referencedTable, config) {
        super(sourceTable, referencedTable, config?.relationName);
        this.config = config;
    }
    withFieldName(fieldName) {
        const relation = new Many(this.sourceTable, this.referencedTable, this.config);
        relation.fieldName = fieldName;
        return relation;
    }
}
export function getOperators() {
    return {
        and,
        between,
        eq,
        exists,
        gt,
        gte,
        ilike,
        inArray,
        isNull,
        isNotNull,
        like,
        lt,
        lte,
        ne,
        not,
        notBetween,
        notExists,
        notLike,
        notIlike,
        notInArray,
        or,
        sql,
    };
}
export function getOrderByOperators() {
    return {
        sql,
        asc,
        desc,
    };
}
export function extractTablesRelationalConfig(schema, configHelpers) {
    if (Object.keys(schema).length === 1
        && 'default' in schema
        && !is(schema['default'], Table)) {
        schema = schema['default'];
    }
    // table DB name -> schema table key
    const tableNamesMap = {};
    // Table relations found before their tables - need to buffer them until we know the schema table key
    const relationsBuffer = {};
    const tablesConfig = {};
    for (const [key, value] of Object.entries(schema)) {
        if (is(value, Table)) {
            const dbName = getTableUniqueName(value);
            const bufferedRelations = relationsBuffer[dbName];
            tableNamesMap[dbName] = key;
            tablesConfig[key] = {
                tsName: key,
                dbName: value[Table.Symbol.Name],
                schema: value[Table.Symbol.Schema],
                columns: value[Table.Symbol.Columns],
                relations: bufferedRelations?.relations ?? {},
                primaryKey: bufferedRelations?.primaryKey ?? [],
            };
            // Fill in primary keys
            for (const column of Object.values(value[Table.Symbol.Columns])) {
                if (column.primary) {
                    tablesConfig[key].primaryKey.push(column);
                }
            }
            const extraConfig = value[Table.Symbol.ExtraConfigBuilder]?.(value[Table.Symbol.ExtraConfigColumns]);
            if (extraConfig) {
                for (const configEntry of Object.values(extraConfig)) {
                    if (is(configEntry, PrimaryKeyBuilder)) {
                        tablesConfig[key].primaryKey.push(...configEntry.columns);
                    }
                }
            }
        }
        else if (is(value, Relations)) {
            const dbName = getTableUniqueName(value.table);
            const tableName = tableNamesMap[dbName];
            const relations = value.config(configHelpers(value.table));
            let primaryKey;
            for (const [relationName, relation] of Object.entries(relations)) {
                if (tableName) {
                    const tableConfig = tablesConfig[tableName];
                    tableConfig.relations[relationName] = relation;
                    if (primaryKey) {
                        tableConfig.primaryKey.push(...primaryKey);
                    }
                }
                else {
                    if (!(dbName in relationsBuffer)) {
                        relationsBuffer[dbName] = {
                            relations: {},
                            primaryKey,
                        };
                    }
                    relationsBuffer[dbName].relations[relationName] = relation;
                }
            }
        }
    }
    return { tables: tablesConfig, tableNamesMap };
}
export function relations(table, relations) {
    return new Relations(table, (helpers) => Object.fromEntries(Object.entries(relations(helpers)).map(([key, value]) => [
        key,
        value.withFieldName(key),
    ])));
}
export function createOne(sourceTable) {
    return function one(table, config) {
        return new One(sourceTable, table, config, (config?.fields.reduce((res, f) => res && f.notNull, true)
            ?? false));
    };
}
export function createMany(sourceTable) {
    return function many(referencedTable, config) {
        return new Many(sourceTable, referencedTable, config);
    };
}
export function normalizeRelation(schema, tableNamesMap, relation) {
    if (is(relation, One) && relation.config) {
        return {
            fields: relation.config.fields,
            references: relation.config.references,
        };
    }
    const referencedTableTsName = tableNamesMap[getTableUniqueName(relation.referencedTable)];
    if (!referencedTableTsName) {
        throw new Error(`Table "${relation.referencedTable[Table.Symbol.Name]}" not found in schema`);
    }
    const referencedTableConfig = schema[referencedTableTsName];
    if (!referencedTableConfig) {
        throw new Error(`Table "${referencedTableTsName}" not found in schema`);
    }
    const sourceTable = relation.sourceTable;
    const sourceTableTsName = tableNamesMap[getTableUniqueName(sourceTable)];
    if (!sourceTableTsName) {
        throw new Error(`Table "${sourceTable[Table.Symbol.Name]}" not found in schema`);
    }
    const reverseRelations = [];
    for (const referencedTableRelation of Object.values(referencedTableConfig.relations)) {
        if ((relation.relationName
            && relation !== referencedTableRelation
            && referencedTableRelation.relationName === relation.relationName)
            || (!relation.relationName
                && referencedTableRelation.referencedTable === relation.sourceTable)) {
            reverseRelations.push(referencedTableRelation);
        }
    }
    if (reverseRelations.length > 1) {
        throw relation.relationName
            ? new Error(`There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`)
            : new Error(`There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[Table.Symbol.Name]}". Please specify relation name`);
    }
    if (reverseRelations[0]
        && is(reverseRelations[0], One)
        && reverseRelations[0].config) {
        return {
            fields: reverseRelations[0].config.references,
            references: reverseRelations[0].config.fields,
        };
    }
    throw new Error(`There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`);
}
export function createTableRelationsHelpers(sourceTable) {
    return {
        one: createOne(sourceTable),
        many: createMany(sourceTable),
    };
}
export function mapRelationalRow(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value) => value) {
    const result = {};
    for (const [selectionItemIndex, selectionItem,] of buildQueryResultSelection.entries()) {
        if (selectionItem.isJson) {
            const relation = tableConfig.relations[selectionItem.tsKey];
            const rawSubRows = row[selectionItemIndex];
            const subRows = typeof rawSubRows === 'string'
                ? JSON.parse(rawSubRows)
                : rawSubRows;
            result[selectionItem.tsKey] = is(relation, One)
                ? subRows
                    && mapRelationalRow(tablesConfig, tablesConfig[selectionItem.relationTableTsKey], subRows, selectionItem.selection, mapColumnValue)
                : subRows.map((subRow) => mapRelationalRow(tablesConfig, tablesConfig[selectionItem.relationTableTsKey], subRow, selectionItem.selection, mapColumnValue));
        }
        else {
            const value = mapColumnValue(row[selectionItemIndex]);
            const field = selectionItem.field;
            let decoder;
            if (is(field, Column)) {
                decoder = field;
            }
            else if (is(field, SQL)) {
                decoder = field.decoder;
            }
            else {
                decoder = field.sql.decoder;
            }
            result[selectionItem.tsKey] = value === null ? null : decoder.mapFromDriverValue(value);
        }
    }
    return result;
}
//# sourceMappingURL=relations.js.map