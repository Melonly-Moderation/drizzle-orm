import { TableAliasProxyHandler } from '~/alias.ts';
export function alias(table, alias) {
    return new Proxy(table, new TableAliasProxyHandler(alias, false));
}
//# sourceMappingURL=alias.js.map