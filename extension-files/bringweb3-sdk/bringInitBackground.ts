import fetchDomains from "./utils/api/fetchDomains.js"
import validateDomain from "./utils/api/validateDomain.js"
import checkEvents from "./utils/api/checkEvents.js"
import { Endpoint, ApiEndpoint } from "./utils/apiEndpoint.js"

import { UPDATE_CACHE_ALARM_NAME, CHECK_EVENTS_ALARM_NAME } from './utils/constants.js'
import storage from "./utils/storage.js"

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

const getRelevantDomain = async (url: string | undefined) => {
    const relevantDomains = await storage.get('relevantDomains')
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

const addQuietDomain = async (domain: string, time?: number) => {
    if (!time) time = quietTime

    let quietDomains = await storage.get('quietDomains')

    if (typeof quietDomains === 'object') {
        quietDomains[domain] = Date.now() + time
    } else {
        quietDomains = { [domain]: Date.now() + quietTime }
    }
    storage.set('quietDomains', quietDomains)
}


interface Configuration {
    identifier: string
    apiEndpoint: Endpoint
}

const bringInitBackground = async ({ identifier, apiEndpoint }: Configuration) => {
    if (!identifier || !apiEndpoint) throw new Error('Missing configuration')
    if (!['prod', 'sandbox'].includes(apiEndpoint)) throw new Error('unknown apiEndpoint')
    ApiEndpoint.getInstance().setApiEndpoint(apiEndpoint)
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

    chrome.runtime.onMessage.addListener(async (request, sender) => {
        const { action, time } = request

        switch (action) {
            case 'OPT_OUT':
                storage.set('optOut', Date.now() + time)
                break;
            case 'CLOSE':
                const domain = await getRelevantDomain(sender.tab?.url || sender.origin)
                if (!domain) break;
                addQuietDomain(domain, time)
                break;
            default:
                console.log(`Unknown action: ${action}`);
                break;
        }
    })

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        const optOut = await storage.get('optOut');

        if (optOut && optOut > Date.now()) return;

        const previousUrl = await storage.get('previousUrl');
        if (changeInfo.status !== 'complete' || tab.url === previousUrl) return;
        if (!tab.url) return;
        storage.set('previousUrl', tab.url)
        console.log('fired');

        const { url } = tab;

        const match = await getRelevantDomain(url);

        if (!match || !match.length) return;

        const address = await getWalletAddress(tabId);
        console.log({ address });

        const { token, isValid } = await validateDomain({
            apiKey: identifier,
            query: {
                domain: match,
                url,
                address
            }
        });

        if (!isValid) {
            addQuietDomain(match);
            return;
        }

        const res = await chrome.tabs.sendMessage(tabId, {
            action: 'INJECT',
            token,
            domain: url
        });
    })
}

export default bringInitBackground