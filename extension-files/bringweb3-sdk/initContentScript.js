import { IFRAME_SRC } from "./config.js";

const ACTIONS = {
    OPEN: 'OPEN',
    CLOSE: 'CLOSE'
}

let iframeEl = null

const initContentScript = () => {
    const applyStyles = (element, style) => {
        if (!element || !style || !Object.keys(style).length) return
        Object.keys(style).forEach(key => {
            element.style[key] = style[key]
        })
    }

    const handleIframeMessages = event => {
        const { data } = event
        const { from, action, style } = data
        if (from !== 'bringweb3') return
        console.log('BRING EVENT:', { event: data });
        switch (action) {
            case ACTIONS.OPEN:
                applyStyles(iframeEl, style)
                console.log('ACTION:', action);
                break;
            case ACTIONS.CLOSE:
                if (iframeEl) iframeEl.style.display = 'none'
                console.log('ACTION:', action);
                break;
            default:
                console.log('Non exist ACTION:', action);
                break;
        }
    }

    window.addEventListener('message', handleIframeMessages)
    function getHighestZIndex() {
        return Math.max(
            ...Array.from(document.querySelectorAll('*'))
                .map(el => parseFloat(window.getComputedStyle(el).zIndex))
                .filter(zIndex => !Number.isNaN(zIndex))
        );
    }

    // setTimeout(() => {
    //     console.log("Highest z-index:", getHighestZIndex());
    // }, 5000);

    const injectIFrame = () => {
        const iframe = document.createElement('iframe');
        iframe.id = "bringweb3-iframe";
        iframe.src = IFRAME_SRC;
        iframe.sandbox = "allow-popups allow-scripts allow-same-origin";
        iframe.style.position = "fixed";
        iframe.style.width = "1px";
        iframe.style.height = "1px";
        iframe.style.right = "8px";
        iframe.style.borderRadius = "10px";
        iframe.style.border = "none";
        iframe.style.cssText += `z-index: 99999999999999 !important;`;
        document.body.insertBefore(iframe, document.body.firstChild);
        iframeEl = iframe
    }


    // Listen for message
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log({ request, sender });
        if (request.type === 'INJECT') {
            console.log(`injecting to: `, request.domain);
            injectIFrame();
        }
        sendResponse({ status: 'success' });
        return true;
    });
}

export default initContentScript;