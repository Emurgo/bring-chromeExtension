import { API_URL } from "../../config";
import getQueryParams from "../getQueryParams";

interface ValidateDomainProps {
    apiKey: string,
    query: {
        url: string,
        domain: string,
        address: WalletAddress,
        country?: string
    }
}

const validateDomain = async ({ apiKey, query }: ValidateDomainProps) => {

    const params = getQueryParams({ query: { ...query, country: 'us' } })

    const res = await fetch(`${API_URL}/token?${params.toString()}`, {
        headers: {
            'x-api-key': apiKey
        }
    })
    const json = await res.json()
    // console.log({ json });
    return json
}

export default validateDomain;