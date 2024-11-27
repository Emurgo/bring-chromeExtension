import getDomain from "../getDomain"
import storage from "../storage"
const quietTime = 30 * 60 * 1000

const addQuietDomain = async (domain: string, time?: number) => {
    domain = getDomain(domain)
    if (!time) time = quietTime

    let quietDomains = await storage.get('quietDomains')

    if (typeof quietDomains === 'object') {
        quietDomains[domain] = Date.now() + time
    } else {
        quietDomains = { [domain]: Date.now() + quietTime }
    }
    storage.set('quietDomains', quietDomains)
}

export default addQuietDomain;