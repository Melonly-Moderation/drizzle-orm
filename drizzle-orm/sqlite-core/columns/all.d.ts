import { blob } from './blob.ts';
import { customType } from './custom.ts';
import { integer } from './integer.ts';
import { numeric } from './numeric.ts';
import { real } from './real.ts';
import { text } from './text.ts';
export declare function getSQLiteColumnBuilders(): {
    blob: typeof blob;
    customType: typeof customType;
    integer: typeof integer;
    numeric: typeof numeric;
    real: typeof real;
    text: typeof text;
};
export type SQLiteColumnBuilders = ReturnType<typeof getSQLiteColumnBuilders>;
