import { ApiEndpoint } from "../apiEndpoint"
import { compress } from "../background/domainsListCompression"
import { strToUint8Array } from "../storage/helpers"
import apiRequest from "./apiRequest"
import thankYouPages from "./tmpThankYou"

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

    if (trigger) request.params.trigger = trigger

    const res = await apiRequest(request)

    res.relevantDomains = strToUint8Array(res.relevantDomains)
    res.thankYouPages = compress(thankYouPages)

    return res
}

export default fetchDomains