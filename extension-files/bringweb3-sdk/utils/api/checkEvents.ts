import apiRequest from "./apiRequest";

interface CheckEventsProps {
    walletAddress: string
    cashbackUrl: string | undefined;
    lastActivation?: number
    timeSinceLastActivation?: number
}

interface Body {
    walletAddress: string;
    cashbackUrl?: string;
    test?: boolean
    lastActivation?: number
    timeSinceLastActivation?: number
}

const checkEvents = async ({ walletAddress, cashbackUrl, lastActivation, timeSinceLastActivation }: CheckEventsProps) => {
    const body: Body = { walletAddress }
    if (lastActivation) body.lastActivation = lastActivation;
    if (timeSinceLastActivation) body.timeSinceLastActivation = timeSinceLastActivation;
    if (cashbackUrl) body.cashbackUrl = cashbackUrl;

    const res = await apiRequest({ path: '/check/notification', method: 'POST', params: body })

    return res
}

export default checkEvents;