import { ApiEndpoint } from "../apiEndpoint"
import apiRequest from "./apiRequest"

const fetchDomains = async () => {
    const whitelistEndpoint = ApiEndpoint.getInstance().getWhitelistEndpoint()

    const request: Parameters<typeof apiRequest>[0] = {
        path: '/domains',
        method: 'GET'
    }

    if (whitelistEndpoint) {
        request.params = { whitelist: encodeURIComponent(whitelistEndpoint) }
    }

    const res = await apiRequest(request)

    return res
}

export default fetchDomains