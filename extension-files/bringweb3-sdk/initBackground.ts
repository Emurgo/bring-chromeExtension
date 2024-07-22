import { fetchDomains, validateDomain } from "./utils/api"
import storage from "./utils/storage"
import { UPDATE_CACHE_ALARM_NAME } from './utils/constants.js'

const calcDelay = (timestamp: number) => {
    const now = Date.now()
    return (timestamp - now) / 1000 / 60 // milliseconds to minutes
}

const updateCache = async (apiKey: string) => {
    const res = await fetchDomains(apiKey)

    storage.set('relevantDomains', res.relevantDomains)

    const { nextUpdateTimestamp } = res

    const delay = calcDelay(nextUpdateTimestamp)

    chrome.alarms.create(UPDATE_CACHE_ALARM_NAME, {
        delayInMinutes: delay
    })
}

const getDomain = (url: string) => {
    return url.replace(/^(https?:\/\/)?(www\.)?/, '');
}

const getRelevantDomain = (relevantDomains: string[], url: string | undefined) => {
    if (!url || !relevantDomains || !relevantDomains.length) return ''
    const domain = getDomain(url)
    // console.log({ relevantDomains, domain });
    for (const relevantDomain of relevantDomains) {
        if (domain.startsWith(relevantDomain) || domain.split('/')[0] === 'aurora.plus') {
            return relevantDomain
        }
    }
    return ''
}

interface InitBackgroundProps {
    apiKey: string
}

const initBackground = async ({ apiKey }: InitBackgroundProps) => {

    await storage.clear()
    updateCache(apiKey)
    chrome.alarms.onAlarm.addListener(async (alarm) => {
        if (alarm.name === UPDATE_CACHE_ALARM_NAME) {
            await updateCache(apiKey)
        }
    })

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        const previousUrl = await storage.get('previousUrl')
        if (changeInfo.status !== 'complete' || tab.url === previousUrl) return
        if (!tab.url) return
        storage.set('previousUrl', tab.url)
        console.log('fired');

        const relevantDomains = await storage.get('relevantDomains')
        const { url } = tab

        const match = getRelevantDomain(relevantDomains, url)

        if (!match || !match.length) return

        const { token, isValid } = await validateDomain({
            apiKey,
            query: {
                domain: match,
                url,
                address: 'TEST'
            }
        })

        if (!isValid) return

        const res = await chrome.tabs.sendMessage(tabId, {
            type: 'INJECT',
            token,
            domain: url
        })
    })
}

export default initBackground