import storage from "../storage";
import checkEvents from "../api/checkEvents";
import getWalletAddress from "./getWalletAddress";

const checkNotifications = async (apiKey: string, tabId?: number, cashbackUrl?: string) => {
    const falseReturn = { showNotification: false, token: '', iframeUrl: '' };

    const nextCall = await storage.get('notificationCheck');

    if (nextCall && Date.now() < nextCall) return falseReturn;

    const walletAddress = tabId ? await getWalletAddress(tabId) : await storage.get('walletAddress')

    if (!walletAddress) return falseReturn;

    const lastActivation = await storage.get('lastActivation')

    const res = await checkEvents({ walletAddress, cashbackUrl, lastActivation });

    storage.set('notificationCheck', res.nextCall);

    const notification = {
        showNotification: res.showNotification as boolean,
        token: res.token as string,
        iframeUrl: res.iframeUrl as string,
        expiration: res.expiration as number
    }

    if (notification.showNotification) {
        await storage.set('notification', notification)
    }

    return notification
}

export default checkNotifications;