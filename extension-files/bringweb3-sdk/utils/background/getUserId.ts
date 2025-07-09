import storage from "../storage"
import { v4 as uuidv4 } from "uuid"

const getUserId = async (): Promise<string | undefined> => {
    let userId = await storage.get('id')
    if (!userId || !userId.includes('-')) {
        userId = uuidv4()
        storage.set('id', userId)
    }
    return userId
}

export default getUserId;