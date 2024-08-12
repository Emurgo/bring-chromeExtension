import applyStyles from "./applyStyles"
import addKeyframes from "./addKeyFrames"

interface Props {
    event: BringEvent
    iframeEl: IFrame
    promptLogin: () => Promise<WalletAddress>
}

const ACTIONS = {
    OPEN: 'OPEN',
    CLOSE: 'CLOSE',
    ACTIVATE: 'ACTIVATE',
    PROMPT_LOGIN: 'PROMPT_LOGIN',
    OPT_OUT: 'OPT_OUT',
    ADD_KEYFRAMES: 'ADD_KEYFRAMES'
}

const handleIframeMessages = ({ event, iframeEl, promptLogin }: Props) => {
    const { data } = event
    const { from, action, style, keyFrames, time } = data

    if (from !== 'bringweb3') return

    switch (action) {
        case ACTIONS.OPEN:
            applyStyles(iframeEl, style)
            break;
        case ACTIONS.CLOSE:
            if (iframeEl) iframeEl.style.display = 'none'
            if (time) chrome.runtime.sendMessage({ action, time })
            break;
        case ACTIONS.PROMPT_LOGIN:
            promptLogin()
            break;
        case ACTIONS.ACTIVATE:
            chrome.runtime.sendMessage({ action })
            break;
        case ACTIONS.OPT_OUT:
            chrome.runtime.sendMessage({ action, time })
            break;
        case ACTIONS.ADD_KEYFRAMES:
            addKeyframes(keyFrames)
            break;
        default:
            console.log('Non exist ACTION:', action);
            break;
    }
}

export default handleIframeMessages;