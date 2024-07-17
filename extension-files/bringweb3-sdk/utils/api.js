import { API_KEY, API_URL } from "../config.js";

export const fetchDomains = async () => {
    const res = await fetch(`${API_URL}?country=us`, {
        headers: {
            'x-api-key': API_KEY
        }
    })
    const json = await res.json()
    // console.log({ json });
    return json
}

export const validateDomain = async (url) => {
    const res = await fetch(`${API_URL}?country=us&domain=${url}`, {
        headers: {
            'x-api-key': API_KEY
        }
    })
    const json = await res.json()
    // console.log({ json });
    return json
}