import apiRequest from "./apiRequest"

const fetchDomains = async (apiKey: string) => {

    const res = await apiRequest({ path: '/domains', apiKey, method: 'GET' })

    return res
}

export default fetchDomains