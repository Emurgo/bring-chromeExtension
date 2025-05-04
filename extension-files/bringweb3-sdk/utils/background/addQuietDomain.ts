import storage from "../storage"

const storageKey = 'quietDomains'

const addQuietDomain = async (domain: string, time: number) => {
    let quietDomains = await storage.get(storageKey)

    if (typeof quietDomains === 'object') {
        quietDomains[domain] = time
    } else {
        quietDomains = { [domain]: time }
    }
    storage.set(storageKey, quietDomains)
}

export default addQuietDomain;