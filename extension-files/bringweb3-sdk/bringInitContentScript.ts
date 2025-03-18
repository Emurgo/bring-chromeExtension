import injectIFrame from "./utils/contentScript/injectIFrame.js";
import handleIframeMessages from "./utils/contentScript/handleIframeMessages.js";
import startListenersForWalletAddress from "./utils/contentScript/startLIstenersForWalletAddress.js";
import parseUrl from "./utils/parseUrl.js";
import getDomain from "./utils/getDomain.js";
let iframeEl: IFrame = null
let isIframeOpen = false

interface Configuration {
    getWalletAddress: () => Promise<WalletAddress>
    walletAddressUpdateCallback?: (callback: () => void) => void
    walletAddressListeners?: string[]
    promptLogin: () => Promise<void>
    lightTheme?: Style
    darkTheme?: Style
    theme: string
    text: 'upper' | 'lower',
    switchWallet: boolean
}

/**
 * Initializes the content script for the Bring extension.
 * 
 * @async
 * @function bringInitContentScript
 * @param {Object} configuration - The configuration object.
 * @param {Function} configuration.getWalletAddress - A function that returns a Promise resolving to the wallet address.
 * @param {Function} configuration.promptLogin - A function to prompt the user to login.
 * @param {string[]} configuration.walletAddressListeners - An optional array of strings representing wallet address listeners.
 * @param {Function} [configuration.walletAddressUpdateCallback] - An optional callback function for wallet address updates.
 * @param {Object} [configuration.lightTheme] - Optional light theme settings.
 * @param {Object} [configuration.darkTheme] - Optional dark theme settings.
 * @param {string} configuration.theme - The chosen theme, light | dark.
 * @param {string} configuration.text - The chosen case for some of the texts, upper | lower.
 * @throws {Error} Throws an error if any required configuration is missing.
 * @returns {Promise<void>}
 * 
 * @description
 * This function sets up event listeners for wallet address changes, iframe messages,
 * and Chrome runtime messages. It handles actions such as getting the wallet address
 * and injecting iframes based on received messages.
 * 
 * @example
 * bringInitContentScript({
 *   getWalletAddress: async () => '0x1234...',
 *   promptLogin: () => { ... },
 *   walletAddressListeners: ["listener1", "listener2"],
 *   theme: 'light',
 *   text: 'lower',
 *   lightTheme: { ... },
 *   darkTheme: { ... }
 * });
 */
const bringInitContentScript = async ({
    getWalletAddress,
    promptLogin,
    walletAddressListeners,
    walletAddressUpdateCallback,
    lightTheme,
    darkTheme,
    theme,
    text,
    switchWallet = false
}: Configuration) => {
    if (window.self !== window.top) {
        return
    }
    if (!getWalletAddress || !promptLogin || (!walletAddressListeners?.length && typeof walletAddressUpdateCallback !== 'function')) throw new Error('Missing configuration')

    startListenersForWalletAddress({
        walletAddressListeners,
        walletAddressUpdateCallback,
        getWalletAddress,
        iframeEl
    })

    window.addEventListener('message', (e) => handleIframeMessages({
        event: e,
        iframeEl,
        promptLogin
    }))

    // Listen for message
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request?.from !== 'bringweb3') return

        const { action } = request

        switch (action) {

            case 'GET_WALLET_ADDRESS':
                getWalletAddress()
                    .then(walletAddress => sendResponse({ status: 'success', walletAddress }))
                    .catch(err => sendResponse({ status: 'success', walletAddress: undefined }))
                return true

            case 'INJECT':
                try {

                    if (getDomain(location.href) !== getDomain(request.domain)) {
                        sendResponse({ status: 'failed', message: 'Domain already changed' });
                        return true
                    } else if (isIframeOpen) {
                        sendResponse({ status: 'failed', message: 'iframe already open' });
                        return true
                    }
                    const { token, iframeUrl, userId } = request;

                    const query: { [key: string]: string } = { token }
                    if (userId) query['userId'] = userId

                    iframeEl = injectIFrame({
                        query,
                        iframeUrl,
                        theme: theme === 'dark' ? darkTheme : lightTheme,
                        themeMode: theme || 'light',
                        text,
                        switchWallet,
                        page: request.page
                    });
                    isIframeOpen = true
                    sendResponse({ status: 'success' });
                    return true
                } catch (error) {
                    if (error instanceof Error) {
                        sendResponse({ status: 'failed', message: error.message });
                    } else {
                        sendResponse({ status: 'failed', message: String(error) });
                    }
                    return true
                }
            default:
                console.error(`Unknown action: ${action}`);
                break;
        }
    });
}

export default bringInitContentScript;