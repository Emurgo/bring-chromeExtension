import storage from "../storage"

const STORAGE_KEY = 'optOutDomains'

const addOptOutDomain = async (domain: string, time?: number) => {
    if (!domain) return
    let optOutDomains = await storage.get(STORAGE_KEY)

    if (typeof optOutDomains === 'object') {
        optOutDomains[domain] = time
    } else {
        optOutDomains = { [domain]: time }
    }
    storage.set(STORAGE_KEY, optOutDomains)
}

export default addOptOutDomain;