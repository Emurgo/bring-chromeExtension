export const sendMessage = (message: Message) => {
    window.parent.postMessage({ type: 'test', from: 'bringweb3', ...message }, '*')
}

export enum ACTIONS {
    OPEN = 'OPEN',
    CLOSE = 'CLOSE',
    OPT_OUT = 'OPT_OUT',
    ADD_KEYFRAMES = 'ADD_KEYFRAMES'
}
