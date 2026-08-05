export function safeParseFloat(value?: unknown): unknown {
    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        if (Number.isNaN(parsed)) {
            return value;
        }
        return parsed;
    }

    return value;
}

export function safeParseBoolean(value?: unknown): unknown {
    if (typeof value === 'string') {
        const lowercased = value.trim().toLowerCase();
        if (lowercased === 'true' || lowercased === '1') {
            return true;
        }
        if (lowercased === 'false' || lowercased === '0') {
            return false;
        }
    }

    return value;
}

export function safeParseJSON(value?: unknown): unknown {
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }
    return value;
}
