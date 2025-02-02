export function isColumnType(column, columnTypes) {
    return columnTypes.includes(column.columnType);
}
export function isWithEnum(column) {
    return 'enumValues' in column && Array.isArray(column.enumValues) && column.enumValues.length > 0;
}
export const isPgEnum = isWithEnum;
//# sourceMappingURL=utils.js.map