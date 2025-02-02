import { entityKind } from '~/entity.ts';
export class ConsoleLogWriter {
    static [entityKind] = 'ConsoleLogWriter';
    write(message) {
        console.log(message);
    }
}
export class DefaultLogger {
    static [entityKind] = 'DefaultLogger';
    writer;
    constructor(config) {
        this.writer = config?.writer ?? new ConsoleLogWriter();
    }
    logQuery(query, params) {
        const stringifiedParams = params.map((p) => {
            try {
                return JSON.stringify(p);
            }
            catch {
                return String(p);
            }
        });
        const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(', ')}]` : '';
        this.writer.write(`Query: ${query}${paramsStr}`);
    }
}
export class NoopLogger {
    static [entityKind] = 'NoopLogger';
    logQuery() {
        // noop
    }
}
//# sourceMappingURL=logger.js.map