import storage from "../storage";
import addQuietDomain from "./addQuietDomain";
import checkNotifications from "./checkNotifications";
import getCashbackUrl from "./getCashbackUrl";

const handleActivate = async (url: string, extensionId: string, identifier: string, cashbackPagePath: string | undefined) => {
    if (extensionId === chrome.runtime.id) {
        await storage.set('lastActivation', Date.now());
    }

    if (url) addQuietDomain(url)

    await checkNotifications(identifier, undefined, getCashbackUrl(cashbackPagePath))
}

export default handleActivate;