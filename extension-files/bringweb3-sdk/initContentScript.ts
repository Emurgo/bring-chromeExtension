import { IFRAME_SRC } from "./config.js";
import getQueryParams from "./utils/getQueryParams.js";

const ACTIONS = {
    OPEN: 'OPEN',
    CLOSE: 'CLOSE',
    OPT_OUT: 'OPT_OUT',
    ADD_KEYFRAMES: 'ADD_KEYFRAMES'
}

type IFrame = HTMLIFrameElement | null

interface Style {
    [key: string]: string
}

interface InjectIFrameProps {
    [key: string]: string
}

interface KeyFrame {
    name: string
    rules: string
}

interface BringEvent {
    data: {
        from: string
        action: string
        style?: Style[]
        keyFrames?: KeyFrame[]
        time?: number
    }
}

let iframeEl: IFrame = null

const initContentScript = () => {

    const addKeyframes = (keyFrames: KeyFrame[] | undefined): void => {
        console.log({ keyFrames });

        if (!keyFrames || !keyFrames.length) return

        const style = document.createElement('style');

        document.head.appendChild(style);

        const sheet = style.sheet;

        if (sheet) {
            keyFrames.forEach(({ name, rules }) => {
                sheet.insertRule(`@keyframes ${name} { ${rules} }`, sheet.cssRules.length);
            })
            // sheet.insertRule(`@keyframes ${name} { ${rules} }`, sheet.cssRules.length);
        } else {
            console.error('Failed to create stylesheet');
        }
    }

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
        const { from, action, style, keyFrames, time } = data
        if (from !== 'bringweb3') return
        console.log('BRING EVENT:', { event: data });
        switch (action) {
            case ACTIONS.OPEN:
                applyStyles(iframeEl, style)
                break;
            case ACTIONS.CLOSE:
                if (iframeEl) iframeEl.style.display = 'none'
                break;
            case ACTIONS.OPT_OUT:
                console.log('DANIEL OPTING');

                chrome.runtime.sendMessage({ action, time })
                break;
            case ACTIONS.ADD_KEYFRAMES:
                addKeyframes(keyFrames)
                break;
            default:
                console.log('Non exist ACTION:', action);
                break;
        }
        console.log('ACTION:', action);
    }

    window.addEventListener('message', handleIframeMessages)

    const injectIFrame = (query: InjectIFrameProps) => {
        const params = getQueryParams(query)
        const iframe = document.createElement('iframe');
        iframe.role = 'dialog'
        iframe.id = "bringweb3-iframe";
        iframe.src = `${IFRAME_SRC}?${params}`;
        iframe.setAttribute('sandbox', "allow-popups allow-scripts allow-same-origin")
        // iframe.sandbox = "allow-popups allow-scripts allow-same-origin";
        iframe.style.position = "fixed";
        iframe.scrolling = "no";
        iframe.style.overflow = "hidden";
        iframe.style.width = "1px";
        iframe.style.height = "1px";
        iframe.style.right = "8px";
        iframe.style.borderRadius = "10px";
        iframe.style.border = "none";
        iframe.style.cssText += `z-index: 99999999999999 !important;`;
        document.documentElement.appendChild(iframe);
        iframeEl = iframe
    }


    // Listen for message
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log({ request, sender });
        if (request.action === 'INJECT') {
            const { token } = request;
            console.log(`injecting to: `, request.domain);
            injectIFrame({ token });
        }
        sendResponse({ status: 'success' });
        return true;
    });
}

export default initContentScript;