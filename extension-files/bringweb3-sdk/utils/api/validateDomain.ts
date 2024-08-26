import { ApiEndpoint } from "../apiEndpoint";
import getQueryParams from "../getQueryParams";

interface ValidateDomainProps {
    apiKey: string,
    body: {
        url: string,
        domain: string,
        address: WalletAddress,
        country?: string
    }
}

const validateDomain = async ({ apiKey, body }: ValidateDomainProps) => {
    const endpoint = ApiEndpoint.getInstance().getApiEndpoint()

    const res = await fetch(`${endpoint}/check/popup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        },
        body: JSON.stringify(body)
    })
    const json = await res.json()
    // console.log({ json });
    return json
}

export default validateDomain;