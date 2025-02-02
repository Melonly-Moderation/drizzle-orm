import { entityKind, is } from '~/entity.ts';
export class PgSequence {
    seqName;
    seqOptions;
    schema;
    static [entityKind] = 'PgSequence';
    constructor(seqName, seqOptions, schema) {
        this.seqName = seqName;
        this.seqOptions = seqOptions;
        this.schema = schema;
    }
}
export function pgSequence(name, options) {
    return pgSequenceWithSchema(name, options, undefined);
}
/** @internal */
export function pgSequenceWithSchema(name, options, schema) {
    return new PgSequence(name, options, schema);
}
export function isPgSequence(obj) {
    return is(obj, PgSequence);
}
//# sourceMappingURL=sequence.js.map