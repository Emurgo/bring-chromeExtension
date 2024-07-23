import { API_URL } from "../../config"

const fetchDomains = async (apiKey: string) => {
    const res = await fetch(`${API_URL}/domains?country=us`, {
        headers: {
            'x-api-key': apiKey
        }
    })
    const json = await res.json()
    // console.log({ json });
    return json
}

export default fetchDomains