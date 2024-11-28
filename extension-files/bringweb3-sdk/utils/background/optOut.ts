import storage from "../storage"

interface OptOut {
    isOptedOut: boolean
}

export const setOptOut = async (time: number): Promise<OptOut> => {
    if (time < 0) {
        await storage.remove('optOut')
        return { isOptedOut: false }
    } else {
        await storage.set('optOut', Date.now() + time)
        return { isOptedOut: true }
    }
}

export const getOptOut = async (): Promise<OptOut> => {
    const optOut = await storage.get('optOut')
    console.log({ isOptedOut: !!(optOut && (optOut > Date.now())) });

    return { isOptedOut: !!(optOut && optOut > Date.now()) };
}