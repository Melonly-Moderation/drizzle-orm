import { Column, getTableColumns, getViewSelectedFields, is, isTable, isView, SQL } from 'drizzle-orm';
import { z } from 'zod';
import { columnToSchema } from './column.ts';
import { isPgEnum } from './utils.ts';
function getColumns(tableLike) {
    return isTable(tableLike) ? getTableColumns(tableLike) : getViewSelectedFields(tableLike);
}
function handleColumns(columns, refinements, conditions, factory) {
    const columnSchemas = {};
    for (const [key, selected] of Object.entries(columns)) {
        if (!is(selected, Column) && !is(selected, SQL) && !is(selected, SQL.Aliased) && typeof selected === 'object') {
            const columns = isTable(selected) || isView(selected) ? getColumns(selected) : selected;
            columnSchemas[key] = handleColumns(columns, refinements[key] ?? {}, conditions, factory);
            continue;
        }
        const refinement = refinements[key];
        if (refinement !== undefined && typeof refinement !== 'function') {
            columnSchemas[key] = refinement;
            continue;
        }
        const column = is(selected, Column) ? selected : undefined;
        const schema = column ? columnToSchema(column, factory) : z.any();
        const refined = typeof refinement === 'function' ? refinement(schema) : schema;
        if (conditions.never(column)) {
            continue;
        }
        else {
            columnSchemas[key] = refined;
        }
        if (column) {
            if (conditions.nullable(column)) {
                columnSchemas[key] = columnSchemas[key].nullable();
            }
            if (conditions.optional(column)) {
                columnSchemas[key] = columnSchemas[key].optional();
            }
        }
    }
    return z.object(columnSchemas);
}
function handleEnum(enum_, factory) {
    const zod = factory?.zodInstance ?? z;
    return zod.enum(enum_.enumValues);
}
const selectConditions = {
    never: () => false,
    optional: () => false,
    nullable: (column) => !column.notNull,
};
const insertConditions = {
    never: (column) => column?.generated?.type === 'always' || column?.generatedIdentity?.type === 'always',
    optional: (column) => !column.notNull || (column.notNull && column.hasDefault),
    nullable: (column) => !column.notNull,
};
const updateConditions = {
    never: (column) => column?.generated?.type === 'always' || column?.generatedIdentity?.type === 'always',
    optional: () => true,
    nullable: (column) => !column.notNull,
};
export const createSelectSchema = (entity, refine) => {
    if (isPgEnum(entity)) {
        return handleEnum(entity);
    }
    const columns = getColumns(entity);
    return handleColumns(columns, refine ?? {}, selectConditions);
};
export const createInsertSchema = (entity, refine) => {
    const columns = getColumns(entity);
    return handleColumns(columns, refine ?? {}, insertConditions);
};
export const createUpdateSchema = (entity, refine) => {
    const columns = getColumns(entity);
    return handleColumns(columns, refine ?? {}, updateConditions);
};
export function createSchemaFactory(options) {
    const createSelectSchema = (entity, refine) => {
        if (isPgEnum(entity)) {
            return handleEnum(entity, options);
        }
        const columns = getColumns(entity);
        return handleColumns(columns, refine ?? {}, selectConditions, options);
    };
    const createInsertSchema = (entity, refine) => {
        const columns = getColumns(entity);
        return handleColumns(columns, refine ?? {}, insertConditions, options);
    };
    const createUpdateSchema = (entity, refine) => {
        const columns = getColumns(entity);
        return handleColumns(columns, refine ?? {}, updateConditions, options);
    };
    return { createSelectSchema, createInsertSchema, createUpdateSchema };
}
//# sourceMappingURL=schema.js.map