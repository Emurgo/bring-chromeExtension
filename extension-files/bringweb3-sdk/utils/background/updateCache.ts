import storage from "../storage"
import fetchDomains from "../api/fetchDomains"
import { fetchWhitelist } from "../api/fetchWhitelist"
import { ApiEndpoint } from "../apiEndpoint"
import { isMsRangeExpired } from "./timestampRange"

const safeStringify = (value: any): string => {
    if (value === undefined) return 'undefined'
    if (value === null) return 'null'
    if (typeof value === 'string') return `"${value}"`
    if (typeof value === 'number' || typeof value === 'boolean') return String(value)
    if (Array.isArray(value)) {
        return `[${value.map(item => {
            if (item === undefined) return 'undefined'
            if (item === null) return 'null'
            return safeStringify(item)
        }).join(', ')}]`
    }
    if (typeof value === 'object') {
        try {
            return JSON.stringify(value, (key, val) => {
                if (val === undefined) return 'undefined'
                return val
            })
        } catch {
            return `{object: ${Object.prototype.toString.call(value)}}`
        }
    }
    return String(value)
}

export const updateCache = async () => {
    const relevantDomainsCheck = await storage.get('relevantDomainsCheck') // This is an array with two elements: [cacheStart, cacheEnd]
    const relevantDomainsList = await storage.get('relevantDomains')
    let whitelist = await storage.get('redirectsWhitelist')
    const whitelistEndpoint = ApiEndpoint.getInstance().getWhitelistEndpoint()

    let trigger: string | null = null
    const now = Date.now()

    // Check all conditions that would require a fetch
    if (!relevantDomainsList) {
        trigger = `no domains in cache - value: ${safeStringify(relevantDomainsList)}`
    } else if (!Array.isArray(relevantDomainsList)) {
        trigger = `domains list isn't an array - value: ${safeStringify(relevantDomainsList)}`
    } else if (!relevantDomainsCheck) {
        trigger = `no domains timestamp check found - value: ${safeStringify(relevantDomainsCheck)}`
    } else if (!Array.isArray(relevantDomainsCheck)) {
        trigger = `invalid domains timestamp check format - not an array - value: ${safeStringify(relevantDomainsCheck)}`
    } else if (relevantDomainsCheck.length !== 2) {
        trigger = `invalid domains timestamp check format - length: ${relevantDomainsCheck.length} - value: ${safeStringify(relevantDomainsCheck)}`
    } else if (relevantDomainsCheck[0] >= now) {
        trigger = `cache expired - range start is bigger than Date.now() - start: ${relevantDomainsCheck[0]}, now: ${now}`
    } else if (now >= relevantDomainsCheck[1]) {
        trigger = `cache expired - range end is smaller than Date.now() - end: ${relevantDomainsCheck[1]}, now: ${now}`
    } else if (whitelistEndpoint && !whitelist?.length) {
        trigger = `missing whitelist data - endpoint: ${whitelistEndpoint}, whitelist: ${safeStringify(whitelist)}`
    } else if (isMsRangeExpired(relevantDomainsCheck as [number, number], now)) {
        trigger = `cache expired - range is expired - range: ${safeStringify(relevantDomainsCheck)}, now: ${now}`
    }

    if (!trigger) {
        return relevantDomainsList
    }

    const res = await fetchDomains(trigger)
    const { nextUpdateTimestamp, relevantDomains } = res // nextUpdateTimestamp is the delta in milliseconds until the next update

    storage.set('relevantDomains', relevantDomains)
    storage.set('relevantDomainsCheck', [now, now + nextUpdateTimestamp])

    whitelist = await fetchWhitelist()

    if (whitelist) {
        storage.set('redirectsWhitelist', whitelist)
    }

    return relevantDomains
}