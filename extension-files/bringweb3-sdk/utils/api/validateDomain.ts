import apiRequest from "./apiRequest"

interface ValidateDomainProps {
    body: {
        url: string,
        domain: string,
        address: WalletAddress,
        country?: string
    }
}

const validateDomain = async ({ body }: ValidateDomainProps) => {

    const res = await apiRequest({ path: '/check/popup', method: 'POST', params: body })

    return res
}

export default validateDomain;