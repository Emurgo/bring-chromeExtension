import fetchDomains from "./utils/api/fetchDomains"
import validateDomain from "./utils/api/validateDomain"
import checkEvents from "./utils/api/checkEvents"

import { UPDATE_CACHE_ALARM_NAME, CHECK_EVENTS_ALARM_NAME } from './utils/constants.js'
import storage from "./utils/storage"

const quietTime = 30 * 60 * 1000

const address = '0xA67BCD6b66114E9D5bde78c1711198449D104b28'
// const address = 'TEST'

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

const checkWalletStatus = async (apiKey: string, walletAddress: string) => {
    if (!walletAddress) return
    const res = await checkEvents({ apiKey, walletAddress })
}

const initWalletStatus = async (apiKey: string, walletAddress: string) => {
    checkWalletStatus(apiKey, walletAddress)
    chrome.alarms.create(CHECK_EVENTS_ALARM_NAME, {
        periodInMinutes: 60 * 24
    })
}

const getDomain = (url: string) => {
    return url.replace(/^(https?:\/\/)?(www\.)?/, '');
}

const getRelevantDomain = async (relevantDomains: string[], url: string | undefined) => {
    if (!url || !relevantDomains || !relevantDomains.length) return ''
    const domain = getDomain(url)
    // console.log({ relevantDomains, domain });
    for (const relevantDomain of relevantDomains) {
        if (domain.startsWith(relevantDomain)) {

            const quietDomains = await storage.get('quietDomains')
            if (quietDomains && quietDomains[relevantDomain] && Date.now() < quietDomains[relevantDomain]) {
                return ''
            }
            return relevantDomain
        }
    }
    return ''
}

interface Configuration {
    apiKey: string
}

const initBackground = async ({ apiKey }: Configuration) => {

    // await storage.clear()

    updateCache(apiKey)

    initWalletStatus(apiKey, address)

    chrome.alarms.onAlarm.addListener(async (alarm) => {
        const { name } = alarm

        switch (name) {
            case UPDATE_CACHE_ALARM_NAME:
                updateCache(apiKey)
                break;
            case CHECK_EVENTS_ALARM_NAME:
                checkWalletStatus(apiKey, address)
                break;
            default:
                console.error('alarm with no use case:', name);
                break;
        }
    })

    chrome.runtime.onMessage.addListener((request, sender) => {
        console.log({ request, sender });
        const { action, time } = request
        switch (action) {
            case 'OPT_OUT':
                storage.set('optOut', Date.now() + time)
                break;

            default:
                break;
        }
    })

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        const optOut = await storage.get('optOut')

        if (optOut && optOut > Date.now()) return

        const previousUrl = await storage.get('previousUrl')
        if (changeInfo.status !== 'complete' || tab.url === previousUrl) return
        if (!tab.url) return
        storage.set('previousUrl', tab.url)
        console.log('fired');

        const relevantDomains = await storage.get('relevantDomains')
        const { url } = tab

        const match = await getRelevantDomain(relevantDomains, url)

        if (!match || !match.length) return

        const { token, isValid } = await validateDomain({
            apiKey,
            query: {
                domain: match,
                url,
                address: address
            }
        })

        if (!isValid) {
            let quietDomains = await storage.get('quietDomains')
            typeof quietDomains === 'object' ?
                (quietDomains[match] = Date.now() + quietTime) :
                (quietDomains = { [match]: Date.now() + quietTime })
            storage.set('quietDomains', quietDomains)
            return
        }

        const res = await chrome.tabs.sendMessage(tabId, {
            action: 'INJECT',
            token,
            domain: url
        })
    })
}

export default initBackground