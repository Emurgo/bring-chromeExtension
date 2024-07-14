const set = async (key, value) => {
    chrome.storage.local.set({ [key]: value },
        () =>
            console.log(`${key} cached successfully`));
}

const get = async (key) => {
    const data = await chrome.storage.local.get(key)
    return data[key]
}

export default {
    set,
    get
}