import storage from "../storage"
const addQuietDomain = async (domain: string, time?: number) => {
    let quietDomains = await storage.get('quietDomains')

    if (typeof quietDomains === 'object') {
        quietDomains[domain] = time
    } else {
        quietDomains = { [domain]: time }
    }
    storage.set('quietDomains', quietDomains)
}

export default addQuietDomain;