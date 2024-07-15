import { fetchRetailers } from "./utils/api.js"
import storage from "./utils/storage.js"

let previousUrl = '';

const updateCache = async () => {
    const retailers = await fetchRetailers()
    storage.set('relevantDomains', retailers.relevantDomains)
}

const getDomain = (url) => {
    return url.replace(/^(https?:\/\/)?(www\.)?/, '');
}

const isRelevant = (relevantDomains, url) => {
    const domain = getDomain(url)
    console.log({ relevantDomains, domain });
    for (let i = 0; i < relevantDomains.length; i++) {
        if (domain.startsWith(relevantDomains[i]) || domain.split('/')[0] === 'aurora.plus') {
            return true
        }
    }
    return false
}

const initialize = async () => {
    updateCache()
    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        // chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
        console.log({ changeInfo, tab });
        if (changeInfo.status !== 'complete' || tab.url === previousUrl) return
        previousUrl = tab.url;
        console.log('fired');
        const relevantDomains = await storage.get('relevantDomains')
        const { url } = tab
        if (isRelevant(relevantDomains, url)) {
            const res = await chrome.tabs.sendMessage(tabId, {
                type: 'INJECT',
                domain: url
            })
            console.log({ res });

        }
    })

    setInterval(async () => updateCache, 1000 * 60);
}

export default {
    initialize
}