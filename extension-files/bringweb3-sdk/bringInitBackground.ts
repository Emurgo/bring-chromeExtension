import fetchDomains from "./utils/api/fetchDomains.js"
import validateDomain from "./utils/api/validateDomain.js"
import checkEvents from "./utils/api/checkEvents.js"
import { ApiEndpoint } from "./utils/apiEndpoint.js"

import { UPDATE_CACHE_ALARM_NAME } from './utils/constants.js'
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

        const res = await sendMessage(tabId, { action: 'GET_WALLET_ADDRESS' });

        if (res?.walletAddress && walletAddress !== res?.walletAddress) {
            walletAddress = res?.walletAddress
            await storage.set('walletAddress', walletAddress as string)
        }
    } catch (error) {
        // console.log("Can't update wallet address");
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
        delayInMinutes: delay || 60 * 24 * 2
    })
    return res.relevantDomains
}

const checkNotifications = async (apiKey: string, tabId: number, cashbackUrl: string | undefined, isAfterActivation?: boolean) => {
    const falseReturn = { showNotification: false, token: '' };

    const nextNotificationCheck = await storage.get('notificationCheck');

    if (nextNotificationCheck?.check && Date.now() < nextNotificationCheck.check) return falseReturn;

    const walletAddress = await getWalletAddress(tabId)

    if (!walletAddress) return falseReturn;

    const res = await checkEvents({ apiKey, walletAddress, cashbackUrl });
    const notifications = {
        check: isAfterActivation ? res.nextRequestTimestampActivated : res.nextRequestTimestampRegular,
        nextRequestTimestampActivated: res.nextRequestTimestampActivated,
        nextRequestTimestampRegular: res.nextRequestTimestampRegular
    }
    storage.set('notificationCheck', notifications);

    return {
        showNotification: res.showNotification as boolean,
        token: res.token as string
    };
}

const getDomain = (url: string) => {
    return url.replace(/^(https?:\/\/)?(www\.)?/, '');
}

const getRelevantDomain = async (url: string | undefined, apiKey: string) => {
    let relevantDomains = await storage.get('relevantDomains')

    if (relevantDomains === undefined) {
        relevantDomains = await updateCache(apiKey)
    }

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

const getCashbackUrl = (cashbackUrl: string | undefined): string | undefined => {
    return cashbackUrl ? chrome.runtime.getURL(cashbackUrl) : undefined;
}

interface Message {
    action: 'INJECT' | 'GET_WALLET_ADDRESS'
    domain?: string
    token?: string
    page?: string
}

const sendMessage = async (tabId: number, message: Message) => {
    const maxRetries = 5;
    const baseDelay = 1000; // 1 second

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            // Check if tab still exists
            const tabInfo = await chrome.tabs.get(tabId);
            if (chrome.runtime.lastError) {
                // console.warn("Tab no longer exists:", chrome.runtime.lastError);
                return;
            }

            const res = await chrome.tabs.sendMessage(tabId, message);
            // console.log("Message sent successfully");
            return res;
        } catch (error) {
            // console.warn(`Attempt ${attempt + 1} failed:`, error);
            if (attempt < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt)));
            }
        }
    }
}

const showNotification = async (identifier: string, tabId: number, cashbackPagePath: string | undefined): Promise<void> => {
    const notification = await checkNotifications(identifier, tabId, getCashbackUrl(cashbackPagePath))

    if (!notification.showNotification) return;
    await sendMessage(tabId, {
        action: 'INJECT',
        token: notification.token,
        page: 'notification',
    })
}

interface UrlDict {
    [key: string]: string
}

const urlsDict: UrlDict = {}

interface Configuration {
    identifier: string
    apiEndpoint: string
    cashbackPagePath?: string
}
/**
 * Initializes the background script for the Bring extension.
 *
 * @async
 * @function bringInitBackground
 * @param {Object} configuration - The configuration object.
 * @param {string} configuration.identifier - The identifier for the extension.
 * @param {string} configuration.apiEndpoint - The API endpoint ('prod' or 'sandbox').
 * @param {string} [configuration.cashbackPagePath] - Optional path to the cashback page.
 * @throws {Error} Throws an error if identifier or apiEndpoint is missing, or if apiEndpoint is invalid.
 * @returns {Promise<void>}
 *
 * @description
 * This function sets up the background processes for the Bring extension. It initializes
 * the API endpoint, sets up listeners for alarms, runtime messages, and tab updates.
 * It handles various actions such as opting out, closing notifications, injecting content
 * based on URL changes, and managing quiet domains.
 *
 * The function performs the following tasks:
 * - Validates and sets the API endpoint
 * - Updates the cache
 * - Sets up listeners for alarms to update cache periodically
 * - Handles runtime messages for opting out and closing notifications
 * - Monitors tab updates to inject content or show notifications based on URL changes
 * - Validates domains and manages quiet domains
 *
 * @example
 * bringInitBackground({
 *   identifier: 'my-extension-id',
 *   apiEndpoint: 'sandbox',
 *   cashbackPagePath: '/cashback.html'
 * });
 */
const bringInitBackground = async ({ identifier, apiEndpoint, cashbackPagePath }: Configuration) => {
    if (!identifier || !apiEndpoint) throw new Error('Missing configuration')
    if (!['prod', 'sandbox'].includes(apiEndpoint)) throw new Error('unknown apiEndpoint')

    ApiEndpoint.getInstance().setApiEndpoint(apiEndpoint)


    updateCache(identifier)

    chrome.alarms.onAlarm.addListener(async (alarm) => {
        const { name } = alarm

        switch (name) {
            case UPDATE_CACHE_ALARM_NAME:
                updateCache(identifier)
                break;
            default:
                console.error('alarm with no use case:', name);
                break;
        }
    })

    chrome.runtime.onMessage.addListener(async (request, sender) => {

        if (request?.from !== 'bringweb3') return

        const { action } = request

        switch (action) {
            case 'ACTIVATE': {
                const notificationCheck = await storage.get('notificationCheck')
                if (!notificationCheck.check || !notificationCheck.nextRequestTimestampActivated) break;
                notificationCheck.check = notificationCheck.nextRequestTimestampActivated;
                storage.set('notificationCheck', notificationCheck)
                break;
            }
            case 'OPT_OUT': {
                const { time } = request
                storage.set('optOut', Date.now() + time)
                break;
            }
            case 'CLOSE': {
                const { time } = request
                const domain = await getRelevantDomain(sender.tab?.url || sender.origin, identifier)
                if (!domain) break;
                addQuietDomain(domain, time)
                break;
            }
            case 'WALLET_ADDRESS_UPDATE': {
                const { walletAddress } = request
                storage.set('walletAddress', walletAddress as string)
                break;
            }
            default: {
                console.warn(`Bring unknown action: ${action}`);
                break;
            }
        }
    })

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
        const optOut = await storage.get('optOut');

        if (optOut && optOut > Date.now()) {
            await showNotification(identifier, tabId, cashbackPagePath);
            return;
        }

        if (!tab.url) return;

        const url = tab.url.replace('www.', '')
        // const urlObj = new URL(tab.url)
        // const url = `${urlObj.hostname.replace('www.', '')}${urlObj.pathname}`

        const previousUrl = urlsDict[tabId];

        if (changeInfo.status !== 'complete' || url === previousUrl) return;

        urlsDict[tabId] = url

        const match = await getRelevantDomain(tab.url, identifier);

        if (!match || !match.length) {
            await showNotification(identifier, tabId, cashbackPagePath)
            return;
        };

        const address = await getWalletAddress(tabId);

        const { token, isValid } = await validateDomain({
            apiKey: identifier,
            body: {
                domain: match,
                url: tab.url,
                address
            }
        });

        if (!isValid) {
            if (isValid === false) addQuietDomain(match);
            return;
        }

        sendMessage(tabId, {
            action: 'INJECT',
            token,
            domain: url
        });
    })

    chrome.tabs.onRemoved.addListener(tabId => delete urlsDict[tabId])
}

export default bringInitBackground