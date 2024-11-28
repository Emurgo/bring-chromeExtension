import storage from "../storage"
import getWalletAddress from "./getWalletAddress"

const getUserId = async (): Promise<string | undefined> => {
    let userId = await storage.get('id')
    const address = await getWalletAddress()
    if (!address && !userId) {
        userId = Math.random().toString(36).substring(2)
        storage.set('id', userId)
    }
    return userId
}

export default getUserId;