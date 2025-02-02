import { entityKind } from '~/entity.ts';
export class TypedQueryBuilder {
    static [entityKind] = 'TypedQueryBuilder';
    /** @internal */
    getSelectedFields() {
        return this._.selectedFields;
    }
}
//# sourceMappingURL=query-builder.js.map