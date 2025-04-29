import { API_URL, API_KEY } from "../config"

interface ActivateProps {
    walletAddress: string
    platformName: string
    retailerId: string
    url: string
    tokenSymbol: string
    flowId: string
    timestamp?: number
}

const activate = async (body: ActivateProps) => {
    body.timestamp = Date.now()

    const res = await fetch(`${API_URL}/activate`, {
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

export default activate