import injectIFrame from "./utils/contentScript/injectIFrame.js";
import handleIframeMessages from "./utils/contentScript/handleIframeMessages.js";
import startListenersForWalletAddress from "./utils/contentScript/startLIstenersForWalletAddress.js";

let iframeEl: IFrame = null
let isIframeOpen = false

interface Configuration {
    iframeEndpoint: string
    getWalletAddress: () => Promise<WalletAddress>
    promptLogin: () => Promise<WalletAddress>
    walletAddressListeners: string[]
    lightTheme?: Style
    darkTheme?: Style
    theme: string
    text: 'upper' | 'lower'
}

/**
 * Initializes the content script for the Bring extension.
 * 
 * @async
 * @function bringInitContentScript
 * @param {Object} configuration - The configuration object.
 * @param {Function} configuration.getWalletAddress - A function that returns a Promise resolving to the wallet address.
 * @param {Function} configuration.promptLogin - A function to prompt the user to login.
 * @param {string[]} configuration.walletAddressListeners - An array of strings representing wallet address listeners.
 * @param {Object} [configuration.lightTheme] - Optional light theme settings.
 * @param {Object} [configuration.darkTheme] - Optional dark theme settings.
 * @param {string} configuration.theme - The chosen theme, light | dark.
 * @param {string} configuration.iframeEndpoint - The endpoint URL for the iframe.
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
 *   iframeEndpoint: 'https://example.com/iframe'
 * });
 */
const bringInitContentScript = async ({
    getWalletAddress,
    promptLogin,
    walletAddressListeners,
    lightTheme,
    darkTheme,
    theme,
    text,
    iframeEndpoint
}: Configuration) => {
    if (!getWalletAddress || !promptLogin || !walletAddressListeners?.length || !iframeEndpoint) throw new Error('Missing configuration')

    startListenersForWalletAddress({
        walletAddressListeners,
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

        const { action } = request

        switch (action) {

            case 'GET_WALLET_ADDRESS':
                getWalletAddress()
                    .then(walletAddress => sendResponse({ status: 'success', walletAddress }))
                    .catch(err => sendResponse({ status: 'success', walletAddress: undefined }))
                return true

            case 'INJECT':
                if (isIframeOpen) {
                    return
                }
                const { token, page } = request;

                iframeEl = injectIFrame({
                    query: { token },
                    iframeSrc: page === 'notification' ?
                        `${iframeEndpoint}notification` : iframeEndpoint,
                    theme: theme === 'dark' ? darkTheme : lightTheme,
                    themeMode: theme || 'light',
                    text
                });
                isIframeOpen = true
                sendResponse({ status: 'success' });
                return true

            default:
                console.error(`Unknown action: ${action}`);
                break;
        }
    });
}

export default bringInitContentScript;