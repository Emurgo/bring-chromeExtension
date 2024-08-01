import { IFRAME_SRC } from "./config.js";
import injectIFrame from "./utils/contentScript/injectIFrame.js";
import handleIframeMessages from "./utils/contentScript/handleIframeMessages.js";
import startListenersForWalletAddress from "./utils/contentScript/startLIstenersForWalletAddress.js";

let iframeEl: IFrame = null


interface Configuration {
    getWalletAddress: () => Promise<WalletAddress>
    promptLogin: () => Promise<WalletAddress>
    walletAddressListeners: string[]
    customTheme?: Style
}



const initContentScript = async ({ getWalletAddress, promptLogin, walletAddressListeners, customTheme }: Configuration) => {
    if (!getWalletAddress || !promptLogin || !walletAddressListeners?.length) return console.error('Missing configuration')

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
                return true

            case 'INJECT':
                const { token } = request;
                console.log(`injecting to: ${request.domain}`);
                iframeEl = injectIFrame({
                    query: { token },
                    iframeSrc: IFRAME_SRC,
                    theme: customTheme
                });
                sendResponse({ status: 'success' });
                return true

            default:
                console.error(`Unkown action: ${action}`);
                break;
        }
    });
}

export default initContentScript;