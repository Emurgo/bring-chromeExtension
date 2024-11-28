import getUserId from "./getUserId";
import sendMessage from "./sendMessage";
import checkNotifications from "./checkNotifications";
import getCashbackUrl from "./getCashbackUrl";
import storage from "../storage";

interface Notification {
    token: string,
    iframeUrl: string,
    showNotification: boolean
}

const show = async (tabId: number, notification: Notification, domain: string) => {
    await sendMessage(tabId, {
        action: 'INJECT',
        page: 'notification',
        token: notification.token,
        iframeUrl: notification.iframeUrl,
        userId: await getUserId(),
        domain
    })
}

const showNotification = async (identifier: string, tabId: number, cashbackPagePath: string | undefined, domain: string): Promise<void> => {
    const notificationFromStorage = await storage.get('notification')

    if (notificationFromStorage?.expiration < Date.now()) {
        await storage.remove('notification')
    } else if (notificationFromStorage) {
        return await show(tabId, notificationFromStorage, domain)
    }

    const notification = await checkNotifications(identifier, tabId, getCashbackUrl(cashbackPagePath))

    if (notification.showNotification) {
        return await show(tabId, notification, domain)
    }
}

export default showNotification;