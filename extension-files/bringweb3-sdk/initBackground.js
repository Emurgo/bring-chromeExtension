import { fetchDomains, validateDomain } from "./utils/api.js"
import storage from "./utils/storage.js"
import { UPDATE_CACHE_ALARM_NAME } from './utils/constants.js'

const calcDelay = (timestamp) => {
    const now = Date.now()
    return (timestamp - now) / 1000 / 60 // milliseconds to minutes
}

const updateCache = async () => {
    const res = await fetchDomains()

    storage.set('relevantDomains', res.relevantDomains)

    const { nextUpdateTimestamp } = res

    const delay = calcDelay(nextUpdateTimestamp)

    chrome.alarms.create(UPDATE_CACHE_ALARM_NAME, {
        delayInMinutes: delay
    })
}

const getDomain = (url) => {
    return url.replace(/^(https?:\/\/)?(www\.)?/, '');
}

const getRelevantDomain = (relevantDomains, url) => {
    const domain = getDomain(url)
    // console.log({ relevantDomains, domain });
    for (let i = 0; i < relevantDomains.length; i++) {
        if (domain.startsWith(relevantDomains[i]) || domain.split('/')[0] === 'aurora.plus') {
            return relevantDomains[i]
        }
    }
    return ''
}

const initBackground = async () => {
    await storage.clear()
    updateCache()
    chrome.alarms.onAlarm.addListener(async (alarm) => {
        if (alarm.name === UPDATE_CACHE_ALARM_NAME) {
            await updateCache()
        }
    })

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        const previousUrl = await storage.get('previousUrl')
        if (changeInfo.status !== 'complete' || tab.url === previousUrl) return
        storage.set('previousUrl', tab.url)
        console.log('fired');

        const relevantDomains = await storage.get('relevantDomains')
        const { url } = tab

        const match = getRelevantDomain(relevantDomains, url)

        if (!match.length) return

        const { validDomain } = await validateDomain(match)

        if (!validDomain) return

        const res = await chrome.tabs.sendMessage(tabId, {
            type: 'INJECT',
            domain: url
        })
    })
}

export default initBackground