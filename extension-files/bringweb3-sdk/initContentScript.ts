import { IFRAME_SRC } from "./config.js";
import getQueryParams from "./utils/getQueryParams.js";

const ACTIONS = {
    OPEN: 'OPEN',
    CLOSE: 'CLOSE'
}

type IFrame = HTMLIFrameElement | null

interface Style {
    [key: string]: string
}

interface InjectIFrameProps {
    [key: string]: string
}

interface BringEvent {
    data: {
        from: string
        action: string
        style?: Style[]
    }
}

let iframeEl: IFrame = null

const initContentScript = () => {

    const applyStyles = (element: IFrame, style: Style[] | undefined) => {
        if (!element || !style || !Object.keys(style).length) return;

        Object.entries(style).forEach(([key, value]) => {
            if (key in element.style) {
                (element.style as any)[key] = value;
            }
        });
    }

    const handleIframeMessages = (event: BringEvent) => {
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

    const injectIFrame = (query: InjectIFrameProps) => {
        const params = getQueryParams(query)
        const iframe = document.createElement('iframe');
        iframe.id = "bringweb3-iframe";
        iframe.src = `${IFRAME_SRC}?${params}`;
        iframe.setAttribute('sandbox', "allow-popups allow-scripts allow-same-origin")
        // iframe.sandbox = "allow-popups allow-scripts allow-same-origin";
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
            const { token } = request;
            console.log(`injecting to: `, request.domain);
            injectIFrame({ token });
        }
        sendResponse({ status: 'success' });
        return true;
    });
}

export default initContentScript;