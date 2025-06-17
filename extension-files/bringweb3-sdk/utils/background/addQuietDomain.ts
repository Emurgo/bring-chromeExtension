import storage from "../storage"

const storageKey = 'quietDomains'

const addQuietDomain = async (domain: string, time: number) => {
    let quietDomains = await storage.get(storageKey)

    if (typeof quietDomains !== 'object' || quietDomains === null) {
        quietDomains = {}
    }

    const now = Date.now()
    const end = now + time

    quietDomains[domain] = [now, end]

    storage.set(storageKey, quietDomains)
}

export default addQuietDomain;