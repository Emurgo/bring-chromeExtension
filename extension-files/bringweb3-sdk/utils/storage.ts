const set = async (key: string, value: string) => {
    chrome.storage.local.set({ [key]: value });
}

const get = async (key: string) => {
    const data = await chrome.storage.local.get(key)
    return data[key]
}

const remove = async (key: string) => {
    chrome.storage.local.remove(key)
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