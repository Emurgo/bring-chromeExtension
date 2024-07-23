declare enum ACTIONS {
    OPEN = 'OPEN',
    CLOSE = 'CLOSE',
    OPT_OUT = 'OPT_OUT',
    ADD_KEYFRAMES = 'ADD_KEYFRAMES'
}

interface Styles {
    [key: string]: string
}

interface Info {
    walletAddress: string
    platformName: string
    retailerId: string
    url: string
    iconUrl: string
}

interface Message {
    action?: ACTIONS
    time?: number
    style?: Styles
    keyFrames?: Styles[]
}