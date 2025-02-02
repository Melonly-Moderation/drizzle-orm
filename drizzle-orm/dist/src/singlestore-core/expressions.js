import { bindIfParam } from '~/expressions.ts';
import { sql } from '~/sql/sql.ts';
export * from '~/expressions.ts';
export function concat(column, value) {
    return sql `${column} || ${bindIfParam(value, column)}`;
}
export function substring(column, { from, for: _for }) {
    const chunks = [sql `substring(`, column];
    if (from !== undefined) {
        chunks.push(sql ` from `, bindIfParam(from, column));
    }
    if (_for !== undefined) {
        chunks.push(sql ` for `, bindIfParam(_for, column));
    }
    chunks.push(sql `)`);
    return sql.join(chunks);
}
// Vectors
export function dotProduct(column, value) {
    return sql `${column} <*> ${JSON.stringify(value)}`;
}
export function euclideanDistance(column, value) {
    return sql `${column} <-> ${JSON.stringify(value)}`;
}
//# sourceMappingURL=expressions.js.map