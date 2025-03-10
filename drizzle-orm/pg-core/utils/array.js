function parsePgArrayValue(arrayString, startFrom, inQuotes) {
    for (let i = startFrom; i < arrayString.length; i++) {
        const char = arrayString[i];
        if (char === '\\') {
            i++;
            continue;
        }
        if (char === '"') {
            return [arrayString.slice(startFrom, i).replace(/\\/g, ''), i + 1];
        }
        if (inQuotes) {
            continue;
        }
        if (char === ',' || char === '}') {
            return [arrayString.slice(startFrom, i).replace(/\\/g, ''), i];
        }
    }
    return [arrayString.slice(startFrom).replace(/\\/g, ''), arrayString.length];
}
export function parsePgNestedArray(arrayString, startFrom = 0) {
    const result = [];
    let i = startFrom;
    let lastCharIsComma = false;
    while (i < arrayString.length) {
        const char = arrayString[i];
        if (char === ',') {
            if (lastCharIsComma || i === startFrom) {
                result.push('');
            }
            lastCharIsComma = true;
            i++;
            continue;
        }
        lastCharIsComma = false;
        if (char === '\\') {
            i += 2;
            continue;
        }
        if (char === '"') {
            const [value, startFrom] = parsePgArrayValue(arrayString, i + 1, true);
            result.push(value);
            i = startFrom;
            continue;
        }
        if (char === '}') {
            return [result, i + 1];
        }
        if (char === '{') {
            const [value, startFrom] = parsePgNestedArray(arrayString, i + 1);
            result.push(value);
            i = startFrom;
            continue;
        }
        const [value, newStartFrom] = parsePgArrayValue(arrayString, i, false);
        result.push(value);
        i = newStartFrom;
    }
    return [result, i];
}
export function parsePgArray(arrayString) {
    const [result] = parsePgNestedArray(arrayString, 1);
    return result;
}
export function makePgArray(array) {
    return `{${array.map((item) => {
        if (Array.isArray(item)) {
            return makePgArray(item);
        }
        if (typeof item === 'string') {
            return `"${item.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
        }
        return `${item}`;
    }).join(',')}}`;
}
//# sourceMappingURL=array.js.map