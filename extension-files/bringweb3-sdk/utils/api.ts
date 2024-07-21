import { API_KEY, API_URL } from "../config";

export const fetchDomains = async () => {
    const res = await fetch(`${API_URL}/domains?country=us`, {
        headers: {
            'x-api-key': API_KEY
        }
    })
    const json = await res.json()
    // console.log({ json });
    return json
}

interface ValidateDomainProps {
    url: string,
    domain: string,
    address: string,
    country?: string
}

export const validateDomain = async (query: ValidateDomainProps) => {

    const params = new URLSearchParams()
    Object.entries(query).forEach(([key, value]) => {
        if (key === 'url') {
            params.append(key, encodeURIComponent(value))
        } else {
            params.append(key, value)
        }
    })
    //test
    params.append('country', 'us')

    const res = await fetch(`${API_URL}/token?${params.toString()}`, {
        headers: {
            'x-api-key': API_KEY
        }
    })
    const json = await res.json()
    // console.log({ json });
    return json
}