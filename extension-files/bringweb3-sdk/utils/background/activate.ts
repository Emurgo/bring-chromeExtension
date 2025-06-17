import storage from "../storage";
import addQuietDomain from "./addQuietDomain";
import checkNotifications from "./checkNotifications";
import getCashbackUrl from "./getCashbackUrl";
import isWhitelisted from "./isWhitelisted";
import { DAY_MS } from "../constants";

const handleActivate = async (domain: string, extensionId: string, cashbackPagePath: string | undefined, time?: number, tabId?: number, redirectUrl?: string) => {
    const now = Date.now();
    if (extensionId === chrome.runtime.id) {
        await storage.set('lastActivation', now);
    }

    if (domain) addQuietDomain(domain, time || DAY_MS)

    if (tabId && redirectUrl) {
        const whitelist = await storage.get('redirectsWhitelist')

        if (await isWhitelisted(redirectUrl, whitelist)) {
            chrome.tabs.update(tabId, { url: redirectUrl })
        }
    }

    await checkNotifications(undefined, getCashbackUrl(cashbackPagePath))
}

export default handleActivate;