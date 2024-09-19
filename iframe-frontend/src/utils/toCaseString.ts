
const toCaseString = (str: string, mode?: 'upper' | 'lower') => {
    if (mode !== 'upper') {
        return str
    }
    return str.toUpperCase()
}

export default toCaseString