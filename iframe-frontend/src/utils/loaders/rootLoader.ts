import { sendMessage, ACTIONS } from "../sendMessage"
import { keyFrames } from "../iframeStyles"
import loadFont from "../loadFont"
import verify from "../../api/verify"
import { selectVariant } from "../ABTest/ABTestVariant"

interface Props {
    request: Request
}

const rootLoader = async ({ request }: Props) => {
    // Set open animation
    sendMessage({ action: ACTIONS.ADD_KEYFRAMES, keyFrames })

    const searchParams = new URL(request.url).searchParams
    const textMode = searchParams.get('textMode') || 'lower'
    const themeMode = searchParams.get('themeMode') || 'light'
    const userId = searchParams.get('userId')

    // Load chosen font
    loadFont(searchParams.get('t_fontUrl'), searchParams.get('t_fontFamily'))
    // Verify token
    const res = await verify(searchParams.get('token'))
    if (res.status !== 200) throw `got ${res.status} code`

    return {
        ...res.info,
        themeMode,
        textMode,
        iconsPath: `/${themeMode}/icons/${res.info.platformName.toUpperCase() || 'DEFAULT'}`,
        variant: selectVariant(userId || res.info.walletAddress || '')
    }
}

export default rootLoader;