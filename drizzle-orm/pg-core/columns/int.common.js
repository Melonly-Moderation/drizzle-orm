import { entityKind } from '~/entity.ts';
import { PgColumnBuilder } from './common.ts';
export class PgIntColumnBaseBuilder extends PgColumnBuilder {
    static [entityKind] = 'PgIntColumnBaseBuilder';
    generatedAlwaysAsIdentity(sequence) {
        if (sequence) {
            const { name, ...options } = sequence;
            this.config.generatedIdentity = {
                type: 'always',
                sequenceName: name,
                sequenceOptions: options,
            };
        }
        else {
            this.config.generatedIdentity = {
                type: 'always',
            };
        }
        this.config.hasDefault = true;
        this.config.notNull = true;
        return this;
    }
    generatedByDefaultAsIdentity(sequence) {
        if (sequence) {
            const { name, ...options } = sequence;
            this.config.generatedIdentity = {
                type: 'byDefault',
                sequenceName: name,
                sequenceOptions: options,
            };
        }
        else {
            this.config.generatedIdentity = {
                type: 'byDefault',
            };
        }
        this.config.hasDefault = true;
        this.config.notNull = true;
        return this;
    }
}
//# sourceMappingURL=int.common.js.map