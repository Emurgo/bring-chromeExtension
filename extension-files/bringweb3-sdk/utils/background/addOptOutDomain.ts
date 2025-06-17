import storage from "../storage"

const STORAGE_KEY = 'optOutDomains'

const addOptOutDomain = async (domain: string, time?: number) => {
    if (!domain) return
    let optOutDomains = await storage.get(STORAGE_KEY)

    const now = Date.now()

    if (typeof optOutDomains === 'object') {
        optOutDomains[domain] = [now, time]
    } else {
        optOutDomains = { [domain]: [now, time] }
    }
    storage.set(STORAGE_KEY, optOutDomains)
}

export default addOptOutDomain;