import { ApiEndpoint } from "../apiEndpoint";

interface CheckEventsProps {
    apiKey: string;
    walletAddress: string
    cashbackUrl: string | undefined;
}

interface Body {
    walletAddress: string;
    cashbackUrl?: string;
    test?: boolean
}

const checkEvents = async ({ apiKey, walletAddress, cashbackUrl }: CheckEventsProps) => {
    const endpoint = ApiEndpoint.getInstance().getApiEndpoint()
    const body: Body = { walletAddress }
    if (cashbackUrl) body.cashbackUrl = cashbackUrl;

    const res = await fetch(`${endpoint}/check-events`, {
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