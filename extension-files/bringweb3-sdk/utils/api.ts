import { API_URL } from "../config";
import getQueryParams from "./getQueryParams";

export const fetchDomains = async (apiKey: string) => {
    const res = await fetch(`${API_URL}/domains?country=us`, {
        headers: {
            'x-api-key': apiKey
        }
    })
    const json = await res.json()
    // console.log({ json });
    return json
}

interface ValidateDomainProps {
    apiKey: string,
    query: {
        url: string,
        domain: string,
        address: string,
        country?: string
    }
}

export const validateDomain = async ({ apiKey, query }: ValidateDomainProps) => {

    const params = getQueryParams({ ...query, country: 'us' })

    const res = await fetch(`${API_URL}/token?${params.toString()}`, {
        headers: {
            'x-api-key': apiKey
        }
    })
    const json = await res.json()
    // console.log({ json });
    return json
}