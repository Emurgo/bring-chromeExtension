import { API_URL } from "../../config";

interface CheckEventsProps {
    apiKey: string;
    walletAddress: string
}

const checkEvents = async ({ apiKey, walletAddress }: CheckEventsProps) => {
    const res = await fetch(`${API_URL}/check-events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        },
        body: JSON.stringify({ walletAddress })
    })
    const json = await res.json()
    console.log(json);

    // return await res.json()
    return json
}

export default checkEvents;