import { fetchRetailers } from "../../../bringweb3-sdk/utils/api"
import storage from "../../../bringweb3-sdk/utils/storage"

const updateCache = async () => {
    const retailers = await fetchRetailers()
    storage.set('relevantDomains', retailers.relevantDomains)
}

const getDomain = (url) => {
    const urlInstance = new URL(url)
    const domain = urlInstance.origin.split('://')[1].replace('www.', '')
    return domain
}

const initialize = async () => {
    updateCache()

    chrome.tabs.onUpdated.addListener(async function (tabId, info, tab) {
        if (info.status === 'complete') {
            const relevantDomains = await storage.get('relevantDomains')

            const domain = getDomain(tab.url)

            if (relevantDomains.includes(domain)) {
                chrome.tabs.sendMessage(tabId, {
                    type: 'INJECT',
                    domain
                });
            }
        }
    })

    setInterval(async () => updateCache, 1000 * 60);
}

export default {
    initialize
}