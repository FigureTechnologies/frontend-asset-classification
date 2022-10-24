export function deepReplace(item: any, key: string | string[], value: any): any {
    if (typeof key === 'string') {
        key = key.split('.')
    }

    if (key.length === 0) {
        throw Error('Unexpected deep replacement on index of 0 length')
    }

    if (key.length === 1) {
        return conditionalReplace(item, key[0], value)
    }

    return conditionalReplace(item, key[0], deepReplace(item[key[0]], key.slice(1), value))
}

function conditionalReplace(item: any, key: string, value: any): any {
    if (item instanceof Array) {
        const indexToReplace = +key
        return item.map((curr, i) => i === indexToReplace ? value : curr)
    }
    return {
        ...item,
        [key]: value
    }
}

export function arrayOrUndefined<T>(arr?: Array<T>): Array<T> | undefined {
    if (arr && arr.length > 0) {
        return arr
    }
    return undefined
}