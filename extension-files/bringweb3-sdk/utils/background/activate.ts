import storage from "../storage";
import addQuietDomain from "./addQuietDomain";
import checkNotifications from "./checkNotifications";
import getCashbackUrl from "./getCashbackUrl";
import isWhitelisted from "./isWhitelisted";

const handleActivate = async (domain: string, extensionId: string, identifier: string, cashbackPagePath: string | undefined, time?: number, tabId?: number, redirectUrl?: string) => {
    if (extensionId === chrome.runtime.id) {
        await storage.set('lastActivation', Date.now());
    }

    if (domain) addQuietDomain(domain, time || Date.now() + 24 * 60 * 60 * 1000)

    if (tabId && redirectUrl) {
        const whitelist = await storage.get('redirectsWhitelist')

        if (await isWhitelisted(redirectUrl, whitelist)) {
            chrome.tabs.update(tabId, { url: redirectUrl })
        }
    }

    await checkNotifications(identifier, undefined, getCashbackUrl(cashbackPagePath))

}

export default handleActivate;