import { iife } from '~/tracing-utils.ts';
import { npmVersion } from '~/version.ts';
let otel;
let rawTracer;
/** @internal */
export const tracer = {
    startActiveSpan(name, fn) {
        if (!otel) {
            return fn();
        }
        if (!rawTracer) {
            rawTracer = otel.trace.getTracer('drizzle-orm', npmVersion);
        }
        return iife((otel, rawTracer) => rawTracer.startActiveSpan(name, ((span) => {
            try {
                return fn(span);
            }
            catch (e) {
                span.setStatus({
                    code: otel.SpanStatusCode.ERROR,
                    message: e instanceof Error ? e.message : 'Unknown error', // eslint-disable-line no-instanceof/no-instanceof
                });
                throw e;
            }
            finally {
                span.end();
            }
        })), otel, rawTracer);
    },
};
//# sourceMappingURL=tracing.js.map