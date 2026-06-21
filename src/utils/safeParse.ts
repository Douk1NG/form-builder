export function safeParseFloat(value?: unknown): number | unknown {
    if (typeof value === 'string') {
        return parseFloat(value);
    }

    return value;
}

export function safeParseNumber(value?: unknown): number | unknown {
    if (typeof value === 'string') {
        return parseFloat(value);
    }

    return value;
}

export function safeParseBoolean(value?: unknown): boolean | unknown {
    if (typeof value === 'string') {
        return Boolean(value);
    }

    return value;
}

export function safeParseJSON(value?: unknown): unknown {
    if (typeof value === 'string') {
        return JSON.parse(value);
    }
    return value;
}
