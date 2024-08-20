declare enum ACTIONS {
    OPEN = 'OPEN',
    CLOSE = 'CLOSE',
    ACTIVATE = 'ACTIVATE',
    PROMPT_LOGIN = 'PROMPT_LOGIN',
    OPT_OUT = 'OPT_OUT',
    ADD_KEYFRAMES = 'ADD_KEYFRAMES'
}

interface Styles {
    [key: string]: string
}

type WalletAddress = string | undefined

interface Info {
    walletAddress: WalletAddress
    platformName: string
    retailerId: string
    name: string
    maxCashback: string
    cashbackSymbol: string
    cashbackCurrency: string
    backgroundColor: string
    retailerTermsUrl: string
    generalTermsUrl: string
    cryptoSymbols: string[]
    iconUrl: string
    url: string
}

interface Message {
    action?: ACTIONS
    time?: number
    style?: Styles
    id?: string
    keyFrames?: Styles[]
}