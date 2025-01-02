import apiRequest from "./apiRequest"

interface ValidateDomainProps {
    apiKey: string,
    body: {
        url: string,
        domain: string,
        address: WalletAddress,
        country?: string
    }
}

const validateDomain = async ({ apiKey, body }: ValidateDomainProps) => {

    const res = await apiRequest({ path: '/check/popup', apiKey, method: 'POST', params: body })

    return res
}

export default validateDomain;