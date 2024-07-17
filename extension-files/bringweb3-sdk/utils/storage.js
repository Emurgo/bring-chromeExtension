const set = async (key, value) => {
    chrome.storage.local.set({ [key]: value },
        () =>
            console.log(`${key} cached successfully`));
}

const get = async (key) => {
    const data = await chrome.storage.local.get(key)
    return data[key]
}

const remove = async (key) => {
    chrome.storage.local.remove(key, () => {
        console.log(`Remove ${key} from cache successfully`)
    })
}

const clear = async () => {
    chrome.storage.local.clear(() => {
        console.log('Cache cleared successfully')
    })
}

export default {
    set,
    get,
    remove,
    clear
}