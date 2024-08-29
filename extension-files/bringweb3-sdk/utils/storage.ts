const set = async (key: string, value: any) => {
    chrome.storage.local.set({ [`bring_${key}`]: value });
}

const get = async (key: string) => {
    const data = await chrome.storage.local.get(`bring_${key}`)
    return data[`bring_${key}`]
}

const remove = async (key: string) => {
    chrome.storage.local.remove(`bring_${key}`)
}

// const clear = async () => {
//     chrome.storage.local.clear(() => {
//         console.log('Cache cleared successfully')
//     })
// }

export default {
    set,
    get,
    remove,
    // clear
}