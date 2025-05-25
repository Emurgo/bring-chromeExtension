import storage from "../storage"
import fetchDomains from "../api/fetchDomains"
import { fetchWhitelist } from "../api/fetchWhitelist"
import { ApiEndpoint } from "../apiEndpoint"

export const updateCache = async () => {
    const relevantDomainsCheck = await storage.get('relevantDomainsCheck')
    const relevantDomainsList = await storage.get('relevantDomains')
    let whitelist = await storage.get('redirectsWhitelist')
    const whitelistEndpoint = ApiEndpoint.getInstance().getWhitelistEndpoint()

    let trigger: string | null = null

    // Check all conditions that would require a fetch
    if (!relevantDomainsList) {
        trigger = 'no domains in cache'
    } else if (!relevantDomainsList.length) {
        trigger = 'empty domains list'
    } else if (!relevantDomainsCheck) {
        trigger = 'no domains timestamp check found'
    } else if (relevantDomainsCheck <= Date.now()) {
        trigger = 'cache expired'
    } else if (whitelistEndpoint && !whitelist?.length) {
        trigger = 'missing whitelist data'
    }

    if (!trigger) {
        return relevantDomainsList
    }

    const res = await fetchDomains(trigger)
    const { nextUpdateTimestamp, relevantDomains } = res

    storage.set('relevantDomains', relevantDomains)
    storage.set('relevantDomainsCheck', nextUpdateTimestamp)

    whitelist = await fetchWhitelist()

    if (whitelist) {
        storage.set('redirectsWhitelist', whitelist)
    }

    return relevantDomains
}