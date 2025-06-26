type WalletAddress = string | undefined

type Endpoint = 'sandbox' | 'prod';

type IFrame = HTMLIFrameElement | null

interface Style {
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
        extensionId: string
        time?: number
        key?: string
        url?: string
        domain?: string
        redirectUrl?: string
    }
}

// "watch": "tsup index.ts --env.IFRAME_URL=http://localhost:5173 --format cjs,esm --dts --watch",
