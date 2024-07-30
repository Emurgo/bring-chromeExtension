import fetchDomains from "./utils/api/fetchDomains"
import validateDomain from "./utils/api/validateDomain"
import checkEvents from "./utils/api/checkEvents"

import { UPDATE_CACHE_ALARM_NAME, CHECK_EVENTS_ALARM_NAME } from './utils/constants.js'
import storage from "./utils/storage"

const quietTime = 30 * 60 * 1000

const getWalletAddress = async (tabId?: number): Promise<WalletAddress> => {
    let walletAddress: WalletAddress = await storage.get('walletAddress')

    try {
        if (!tabId) {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
            if (!tabs || !tabs[0] || !tabs[0].id) return walletAddress;
            tabId = tabs[0].id
        }

        const res = await chrome.tabs.sendMessage(tabId, { action: 'GET_WALLET_ADDRESS' });

        if (res?.walletAddress && walletAddress !== res?.walletAddress) {
            walletAddress = res?.walletAddress
            await storage.set('walletAddress', walletAddress as string)
        }
    } catch (error) {
        console.log("Can't update wallet address");
    }

    return walletAddress
}

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

const checkWalletStatus = async (apiKey: string, walletAddress: WalletAddress) => {
    if (!walletAddress) return
    const res = await checkEvents({ apiKey, walletAddress })
}

const initWalletStatus = async (apiKey: string, walletAddress: WalletAddress) => {
    if (!walletAddress) return
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
    identifier: string
}

const initBackground = async ({ identifier }: Configuration) => {

    // await storage.clear()

    updateCache(identifier)

    initWalletStatus(identifier, await getWalletAddress())

    chrome.alarms.onAlarm.addListener(async (alarm) => {
        const { name } = alarm

        switch (name) {
            case UPDATE_CACHE_ALARM_NAME:
                updateCache(identifier)
                break;
            case CHECK_EVENTS_ALARM_NAME:
                checkWalletStatus(identifier, await getWalletAddress())
                break;
            default:
                console.error('alarm with no use case:', name);
                break;
        }
    })

    chrome.runtime.onMessage.addListener((request, sender) => {
        const { action, time } = request
        switch (action) {
            case 'OPT_OUT':
                storage.set('optOut', Date.now() + time)
                break;
            default:
                console.log(`Unknown action: ${action}`);
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

        const address = await getWalletAddress(tabId)
        console.log({ address });

        const { token, isValid } = await validateDomain({
            apiKey: identifier,
            query: {
                domain: match,
                url,
                address: undefined
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