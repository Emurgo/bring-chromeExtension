import apiRequest from "./apiRequest"

interface Body {
    type: string
    userId?: string
    walletAddress?: string
    category?: string
    action?: string
    process?: string
    details?: unknown
    flowId: string
}

const analytics = async (body: Body) => {
    body.category = body?.category || 'system'

    await apiRequest({
        path: '/analytics',
        method: 'POST',
        params: body
    })
}

export default analytics