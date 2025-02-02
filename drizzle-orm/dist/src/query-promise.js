import { entityKind } from '~/entity.ts';
export class QueryPromise {
    static [entityKind] = 'QueryPromise';
    [Symbol.toStringTag] = 'QueryPromise';
    catch(onRejected) {
        return this.then(undefined, onRejected);
    }
    finally(onFinally) {
        return this.then((value) => {
            onFinally?.();
            return value;
        }, (reason) => {
            onFinally?.();
            throw reason;
        });
    }
    then(onFulfilled, onRejected) {
        return this.execute().then(onFulfilled, onRejected);
    }
}
//# sourceMappingURL=query-promise.js.map