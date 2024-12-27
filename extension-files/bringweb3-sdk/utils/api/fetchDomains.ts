import { ApiEndpoint } from "../apiEndpoint"

const fetchDomains = async (apiKey: string) => {
    const endpoint = ApiEndpoint.getInstance().getApiEndpoint()

    const res = await fetch(`${endpoint}/domains?country=ALL`, {
        headers: {
            'x-api-key': apiKey
        }
    })
    const json = await res.json()
    // console.log({ json });
    return json
}

export default fetchDomains