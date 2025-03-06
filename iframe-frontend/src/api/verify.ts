import { API_URL, API_KEY } from "../config"

type Token = string | null


interface VerifyResponse {
    status: number
    info: Info
}

const verify = async (token: Token): Promise<VerifyResponse> => {
    const body = {
        token,
        timestamp: Date.now()
    }

    const res = await fetch(`${API_URL}/verify`, {
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

export default verify