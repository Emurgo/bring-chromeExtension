import storage from "../storage/storage";
import addQuietDomain from "./addQuietDomain";
import checkNotifications from "./checkNotifications";
import getCashbackUrl from "./getCashbackUrl";
import isWhitelisted from "./isWhitelisted";
import { DAY_MS } from "../constants";
import closeAllPopups from "./closeAllPopups";

const handleActivate = async (domain: string, extensionId: string, cashbackPagePath: string | undefined, time?: number, tabId?: number, iframeUrl?: string, token?: string, flowId?: string, redirectUrl?: string) => {
    const now = Date.now();

    const isSameExtension = extensionId === chrome.runtime.id

    if (isSameExtension) {
        await storage.set('lastActivation', now);
    }

    const phase = isSameExtension ? 'activated' : 'quiet';
    console.log(phase)

    if (domain) addQuietDomain(domain, time || DAY_MS, { iframeUrl, token, flowId }, phase);

    closeAllPopups(domain, tabId || -1);

    if (tabId && redirectUrl) {
        if (await isWhitelisted(redirectUrl)) {
            chrome.tabs.update(tabId, { url: redirectUrl })
        }
    }

    await checkNotifications(undefined, getCashbackUrl(cashbackPagePath))
}

export default handleActivate;