import { ApiEndpoint } from "../apiEndpoint"
import { compress } from "../background/domainsListCompression"
import { strToUint8Array } from "../storage/helpers"
import apiRequest from "./apiRequest"

const fetchDomains = async (trigger?: string | null) => {
    const whitelistEndpoint = ApiEndpoint.getInstance().getWhitelistEndpoint()

    const request: Parameters<typeof apiRequest>[0] = {
        path: '/domains',
        method: 'GET',
    }

    request.params = {}

    if (whitelistEndpoint) {
        request.params.whitelist = encodeURIComponent(whitelistEndpoint)
    }

    if (trigger) {
        request.params.trigger = trigger
    }

    const res = await apiRequest(request)
    if (Array.isArray(res?.relevantDomains) && !(res.relevantDomains instanceof Uint8Array) && res.relevantDomains.every((domain: string) => typeof domain === 'string')) {
        // Ensure the response is in the expected format
        res.relevantDomains = compress(res.relevantDomains)
    } else if (typeof res?.relevantDomains === 'string') {
        res.relevantDomains = strToUint8Array(res.relevantDomains)
    }
    console.log({ relevantDomains: res?.relevantDomains, type: typeof res?.relevantDomains });

    return res
}

export default fetchDomains