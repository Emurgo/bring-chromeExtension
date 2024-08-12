export const sendMessage = (message: Message) => {
    window.parent.postMessage({ type: 'test', from: 'bringweb3', ...message }, '*')
}

export enum ACTIONS {
    OPEN = 'OPEN',
    CLOSE = 'CLOSE',
    ACTIVATE = 'ACTIVATE',
    PROMPT_LOGIN = 'PROMPT_LOGIN',
    OPT_OUT = 'OPT_OUT',
    ADD_KEYFRAMES = 'ADD_KEYFRAMES'
}
