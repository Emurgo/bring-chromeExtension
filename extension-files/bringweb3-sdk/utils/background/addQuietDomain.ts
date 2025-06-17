import storage from "../storage"

const storageKey = 'quietDomains'

const addQuietDomain = async (domain: string, time: number) => {
    let quietDomains = await storage.get(storageKey)

    const now = Date.now()

    if (typeof quietDomains === 'object') {
        quietDomains[domain] = [now, time]
    } else {
        quietDomains = { [domain]: [now, time] }
    }
    storage.set(storageKey, quietDomains)
}

export default addQuietDomain;