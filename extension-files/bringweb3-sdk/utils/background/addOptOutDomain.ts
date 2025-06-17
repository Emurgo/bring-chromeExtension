import storage from "../storage"

const STORAGE_KEY = 'optOutDomains'

const addOptOutDomain = async (domain: string, time: number) => {
    if (!domain) return
    console.log({ time });

    let optOutDomains = await storage.get(STORAGE_KEY)

    if (typeof optOutDomains !== 'object' || optOutDomains === null) {
        optOutDomains = {}
    }

    const now = Date.now()
    const end = now + time

    optOutDomains[domain] = [now, end]

    storage.set(STORAGE_KEY, optOutDomains)
}

export default addOptOutDomain;