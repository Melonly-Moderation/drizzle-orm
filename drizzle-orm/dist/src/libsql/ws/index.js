import { createClient } from '@libsql/client/ws';
import { isConfig } from '~/utils.ts';
import { construct } from '../driver-core.ts';
export function drizzle(...params) {
    if (typeof params[0] === 'string') {
        const instance = createClient({
            url: params[0],
        });
        return construct(instance, params[1]);
    }
    if (isConfig(params[0])) {
        const { connection, client, ...drizzleConfig } = params[0];
        if (client)
            return construct(client, drizzleConfig);
        const instance = typeof connection === 'string' ? createClient({ url: connection }) : createClient(connection);
        return construct(instance, drizzleConfig);
    }
    return construct(params[0], params[1]);
}
(function (drizzle) {
    function mock(config) {
        return construct({}, config);
    }
    drizzle.mock = mock;
})(drizzle || (drizzle = {}));
//# sourceMappingURL=index.js.map