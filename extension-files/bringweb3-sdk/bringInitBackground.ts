import { openExtensionCashbackPage } from './utils/background/openExtensionCashbackPage';
import validateDomain from "./utils/api/validateDomain.js"
import { ApiEndpoint } from "./utils/apiEndpoint.js"
import parseUrl from "./utils/parseUrl.js"
import { UPDATE_CACHE_ALARM_NAME } from './utils/constants.js'
import storage from "./utils/storage.js"
import handleActivate from "./utils/background/activate.js"
import addQuietDomain from "./utils/background/addQuietDomain.js"
import { getOptOut, setOptOut } from "./utils/background/optOut.js"
import getWalletAddress from "./utils/background/getWalletAddress.js"
import sendMessage from "./utils/background/sendMessage.js"
import getUserId from "./utils/background/getUserId.js"
import showNotification from "./utils/background/showNotification.js"
import isWhitelisted from './utils/background/isWhitelisted';
import { updateCache } from './utils/background/updateCache';
import removeTrailingSlash from './utils/background/removeTrailingSlash';
import analytics from './utils/api/analytics';

const urlRemoveOptions = ['www.', 'www1.', 'www2.']

const getRelevantDomain = async (url: string | undefined) => {
    const relevantDomains = await updateCache()

    if (!url || !relevantDomains || !relevantDomains.length) return ''

    let urlObj = null

    try {
        urlObj = new URL(url)
    } catch (error) {
        urlObj = new URL(`https://${url}`)
    }

    let tabDomain = urlObj.hostname
    let tabPath = removeTrailingSlash(urlObj.pathname)

    for (const urlRemoveOption of urlRemoveOptions) {
        tabDomain = tabDomain.replace(urlRemoveOption, '')
    }

    for (let relevantDomain of relevantDomains) {
        const originalRelevantDomain = relevantDomain
        relevantDomain = removeTrailingSlash(relevantDomain)
        let allowSubdomain = false

        if (relevantDomain.startsWith('*.')) {
            allowSubdomain = true
        }

        const relevantDomainPath = "/" + relevantDomain.split('/').slice(1).join('/') || '';

        if (relevantDomainPath !== '/' && tabPath.startsWith(relevantDomainPath)) {
            tabDomain += relevantDomainPath
        }

        if (tabDomain === relevantDomain || (allowSubdomain && tabDomain.endsWith(relevantDomain.replace('*.', '')))) {

            const quietDomains = await storage.get('quietDomains')
            if (quietDomains && 
                (quietDomains[relevantDomain] && Date.now() < quietDomains[relevantDomain] 
                && quietDomains[relevantDomain] < Date.now() + 60 * 24 * 60 * 60 * 1000) ) {
                return ''
            }
            return originalRelevantDomain
        }
    }
    return ''
}

interface UrlDict {
    [key: string]: string
}

const urlsDict: UrlDict = {}

interface Configuration {
    identifier: string
    apiEndpoint: string
    whitelistEndpoint?: string
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
 * @param {string} configuration.whitelistEndpoint - Endpoint for whitelist of redirect urls.
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
 *   identifier: '<bring_identifier>',
 *   apiEndpoint: 'sandbox',
 *   whitelistEndpoint: 'https://example.com/whitelist.json',
 *   cashbackPagePath: '/cashback.html'
 * });
 */
const bringInitBackground = async ({ identifier, apiEndpoint, cashbackPagePath, whitelistEndpoint }: Configuration) => {
    if (!identifier || !apiEndpoint) throw new Error('Missing configuration')
    if (!['prod', 'sandbox'].includes(apiEndpoint)) throw new Error('unknown apiEndpoint')

    ApiEndpoint.getInstance().setApiEndpoint(apiEndpoint)
    ApiEndpoint.getInstance().setWhitelistEndpoint(whitelistEndpoint || '')
    ApiEndpoint.getInstance().setApiKey(identifier)

    updateCache()

    chrome.alarms.onAlarm.addListener(async (alarm) => {
        const { name } = alarm

        switch (name) {
            case UPDATE_CACHE_ALARM_NAME:
                updateCache()
                break;
            default:
                console.error('alarm with no use case:', name);
                break;
        }
    })

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

        if (request?.from !== 'bringweb3') return

        const { action } = request

        switch (action) {
            case 'ACTIVATE': {
                const { domain, extensionId, time, redirectUrl } = request
                handleActivate(domain, extensionId, identifier, cashbackPagePath, time, sender.tab?.id, redirectUrl)
                    .then(() => sendResponse());
                return true;
            }
            case 'GET_OPT_OUT': {
                getOptOut().then(res => sendResponse(res))
                return true;
            }
            case 'OPT_OUT': {
                const { time } = request
                setOptOut(time).then(res => sendResponse(res))
                return true;
            }
            case 'CLOSE': {
                const { time, domain } = request
                if (!domain) return true;
                addQuietDomain(domain, time)
                sendResponse({ message: 'domain added to quiet list' })
                return true;
            }
            case 'WALLET_ADDRESS_UPDATE': {
                const { walletAddress } = request
                if (!walletAddress) {
                    storage.remove('walletAddress')
                        .then(() => sendResponse({ message: 'wallet address removed successfully' }))
                } else {
                    storage.set('walletAddress', walletAddress as string)
                        .then(() => sendResponse(walletAddress))
                }
                return true;
            }
            case 'ERASE_NOTIFICATION':
                storage.remove('notification')
                    .then(() => sendResponse({ message: 'notification erased successfully' }))
                return true
            default: {
                console.warn(`Bring unknown action: ${action}`);
                return true;
            }
            case 'OPEN_CASHBACK_PAGE':
                const { url } = request
                openExtensionCashbackPage(url || cashbackPagePath)
                sendResponse({ message: 'cashback page opened successfully' })
                return true
        }
    })

    chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {

        if (!tab?.url?.startsWith('http') || !tab.url) return;

        const url = parseUrl(tab.url)

        const optOut = await storage.get('optOut');

        if (optOut && optOut > Date.now()) {
            return;
        } else if (optOut) {
            storage.remove('optOut')
            storage.remove('optOutKey')
        }

        const previousUrl = urlsDict[tabId];

        if (changeInfo.status !== 'complete' || url === previousUrl) return;

        urlsDict[tabId] = url

        const match = await getRelevantDomain(tab.url);

        if (!match || !match.length) {
            await showNotification(identifier, tabId, cashbackPagePath, url)
            return;
        };

        const address = await getWalletAddress(tabId);

        const { token, isValid, iframeUrl, networkUrl, flowId, time = Date.now() + 2 * 60 * 60 * 1000 } = await validateDomain({
            body: {
                domain: match,
                url: tab.url,
                address
            }
        });

        if (!isValid) {
            if (isValid === false) addQuietDomain(match, time);
            return;
        }
        if (!await isWhitelisted(networkUrl, await storage.get('redirectsWhitelist'))) return;

        const userId = await getUserId()

        const res = await sendMessage(tabId, {
            action: 'INJECT',
            token,
            domain: url,
            iframeUrl,
            userId
        });

        if (res?.status !== 'success') {
            analytics({
                type: 'no_popup',
                userId,
                walletAddress: address,
                details: { url: tab.url, match, iframeUrl, reason: res?.message, status: res?.status },
                flowId
            })
        }
    })

    chrome.tabs.onRemoved.addListener(tabId => delete urlsDict[tabId])
}

export default bringInitBackground