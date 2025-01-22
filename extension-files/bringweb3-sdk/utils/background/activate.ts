import storage from "../storage";
import addQuietDomain from "./addQuietDomain";
import checkNotifications from "./checkNotifications";
import getCashbackUrl from "./getCashbackUrl";

const handleActivate = async (domain: string, extensionId: string, identifier: string, cashbackPagePath: string | undefined, time?: number) => {
    if (extensionId === chrome.runtime.id) {
        await storage.set('lastActivation', Date.now());
    }

    if (domain) addQuietDomain(domain, time || Date.now() + 24 * 60 * 60 * 1000)

    await checkNotifications(identifier, undefined, getCashbackUrl(cashbackPagePath))
}

export default handleActivate;