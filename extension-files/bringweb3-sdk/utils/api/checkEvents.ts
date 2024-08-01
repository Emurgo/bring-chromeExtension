import { ApiEndpoint } from "../apiEndpoint";

interface CheckEventsProps {
    apiKey: string;
    walletAddress: string
}

const checkEvents = async ({ apiKey, walletAddress }: CheckEventsProps) => {
    const endpoint = ApiEndpoint.getInstance().getApiEndpoint()
    const res = await fetch(`${endpoint}/check-events`, {
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