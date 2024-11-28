import { ApiEndpoint } from "../apiEndpoint";

interface CheckEventsProps {
    apiKey: string;
    walletAddress: string
    cashbackUrl: string | undefined;
    lastActivation?: number
}

interface Body {
    walletAddress: string;
    cashbackUrl?: string;
    test?: boolean
    lastActivation?: number
}

const checkEvents = async ({ apiKey, walletAddress, cashbackUrl, lastActivation }: CheckEventsProps) => {
    const endpoint = ApiEndpoint.getInstance().getApiEndpoint()
    const body: Body = { walletAddress }
    if (lastActivation) body.lastActivation = lastActivation;
    if (cashbackUrl) body.cashbackUrl = cashbackUrl;

    const res = await fetch(`${endpoint}/check/notification`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        },
        body: JSON.stringify(body)
    })
    const json = await res.json()

    return json
}

export default checkEvents;