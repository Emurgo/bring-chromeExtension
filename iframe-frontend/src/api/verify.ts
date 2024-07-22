import { API_URL, API_KEY } from "../config"

type Token = string | null


interface VerifyResponse {
    status: number
    info: {
        walletAddress: string
        platformName: string
        retailerId: string
        url: string
    }
}

const verify = async (token: Token): Promise<VerifyResponse> => {
    const res = await fetch(`${API_URL}/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
        },
        body: JSON.stringify({ token })
    })
    const json = await res.json()
    return json
}

export default verify