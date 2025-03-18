import storage from "../storage"
import fetchDomains from "../api/fetchDomains"
import { fetchWhitelist } from "../api/fetchWhitelist"
import { UPDATE_CACHE_ALARM_NAME } from "../constants"
import { ApiEndpoint } from "../apiEndpoint"

const calcDelay = (timestamp: number) => {
    const now = Date.now()
    return (timestamp - now) / 1000 / 60 // milliseconds to minutes
}

export const updateCache = async () => {
    const relevantDomainsCheck = await storage.get('relevantDomainsCheck')
    const relevantDomainsList = await storage.get('relevantDomains')
    let whitelist = await storage.get('redirectsWhitelist')
    const apiKey = ApiEndpoint.getInstance().getApiKey()
    const whitelistEndpoint = ApiEndpoint.getInstance().getWhitelistEndpoint()

    if (relevantDomainsList?.length && relevantDomainsCheck && relevantDomainsCheck > Date.now() && (!whitelistEndpoint || (whitelistEndpoint && whitelist?.length))) {
        return relevantDomainsList
    }

    const res = await fetchDomains()
    const { nextUpdateTimestamp, relevantDomains } = res

    storage.set('relevantDomains', relevantDomains)
    storage.set('relevantDomainsCheck', nextUpdateTimestamp)

    whitelist = await fetchWhitelist()

    if (whitelist) {
        storage.set('redirectsWhitelist', whitelist)
    }

    const delay = calcDelay(nextUpdateTimestamp)

    chrome.alarms.create(UPDATE_CACHE_ALARM_NAME, {
        delayInMinutes: delay || 60 * 24 * 2
    })

    return relevantDomains
}