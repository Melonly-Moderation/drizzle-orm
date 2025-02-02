import { entityKind } from '~/entity.ts';
import { getColumnNameAndConfig } from '~/utils.ts';
import { MySqlColumn, MySqlColumnBuilder } from './common.ts';
export class MySqlTextBuilder extends MySqlColumnBuilder {
    static [entityKind] = 'MySqlTextBuilder';
    constructor(name, textType, config) {
        super(name, 'string', 'MySqlText');
        this.config.textType = textType;
        this.config.enumValues = config.enum;
    }
    /** @internal */
    build(table) {
        return new MySqlText(table, this.config);
    }
}
export class MySqlText extends MySqlColumn {
    static [entityKind] = 'MySqlText';
    textType = this.config.textType;
    enumValues = this.config.enumValues;
    getSQLType() {
        return this.textType;
    }
}
export function text(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new MySqlTextBuilder(name, 'text', config);
}
export function tinytext(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new MySqlTextBuilder(name, 'tinytext', config);
}
export function mediumtext(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new MySqlTextBuilder(name, 'mediumtext', config);
}
export function longtext(a, b = {}) {
    const { name, config } = getColumnNameAndConfig(a, b);
    return new MySqlTextBuilder(name, 'longtext', config);
}
//# sourceMappingURL=text.js.map