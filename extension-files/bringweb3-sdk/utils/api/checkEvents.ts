import apiRequest from "./apiRequest";

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
    const body: Body = { walletAddress }
    if (lastActivation) body.lastActivation = lastActivation;
    if (cashbackUrl) body.cashbackUrl = cashbackUrl;

    const res = await apiRequest({ path: '/check/notification', apiKey, method: 'POST', params: body })

    return res
}

export default checkEvents;