import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { SingleStoreColumn, SingleStoreColumnBuilder } from './common.ts';
export class SingleStoreTextBuilder extends SingleStoreColumnBuilder {
    static [entityKind] = 'SingleStoreTextBuilder';
    constructor(name, textType, config) {
        super(name, 'string', 'SingleStoreText');
        this.config.textType = textType;
        this.config.enumValues = config.enum;
    }
    /** @internal */
    build(table) {
        return new SingleStoreText(table, this.config);
    }
}
export class SingleStoreText extends SingleStoreColumn {
    static [entityKind] = 'SingleStoreText';
    textType = this.config.textType;
    enumValues = this.config.enumValues;
    getSQLType() {
        return this.textType;
    }
}
export function text(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new SingleStoreTextBuilder(name, 'text', config);
}
export function tinytext(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new SingleStoreTextBuilder(name, 'tinytext', config);
}
export function mediumtext(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new SingleStoreTextBuilder(name, 'mediumtext', config);
}
export function longtext(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new SingleStoreTextBuilder(name, 'longtext', config);
}
//# sourceMappingURL=text.js.map