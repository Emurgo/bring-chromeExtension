import { API_URL, API_KEY } from "../config"

interface Body {
    type: string
    platform: string
    userId?: string
    walletAddress?: string
    testId: string
    testVariant: string
    category?: string
    action?: string
    process?: string
    details?: unknown
    retailer?: string
}

const analytics = async (body: Body) => {
    const res = await fetch(`${API_URL}/analytics`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
        },
        body: JSON.stringify(body)
    })
    const json = await res.json()
    return json
}

export default analytics