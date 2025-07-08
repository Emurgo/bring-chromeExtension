const safeStringify = (value: any): string => {
    if (value === undefined) return 'undefined'
    if (value === null) return 'null'
    if (typeof value === 'string') return `"${value}"`
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    if (Array.isArray(value)) {
        return `[${value.map(item => {
            if (item === undefined) return 'undefined'
            if (item === null) return 'null'
            return safeStringify(item)
        }).join(', ')}]`
    }
    if (typeof value === 'object') {
        try {
            return JSON.stringify(value, (key, val) => {
                if (val === undefined) return 'undefined'
                return val
            })
        } catch {
            return `{object: ${Object.prototype.toString.call(value)}}`
        }
    }
    return String(value)
}

export default safeStringify;