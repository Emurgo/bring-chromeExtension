import storage from "../storage/storage"
import { searchCompressed } from "./domainsListCompression"
import analytics from "../api/analytics"

const urlRemoveOptions = ['www.', 'www1.', 'www2.']
const falseResponse = { matched: false, match: '' }

const checkThankYouPage = async (url: string) => {

    let urlObj = null

    try {
        urlObj = new URL(url)
    } catch (error) {
        try {
            urlObj = new URL(`https://${url}`)
        } catch (error) {
            return falseResponse
        }
    }

    let { hostname, pathname } = urlObj

    for (const urlRemoveOption of urlRemoveOptions) {
        hostname = hostname.replace(urlRemoveOption, '')
    }

    if (!pathname.endsWith('/')) pathname += '/'

    let query = hostname + pathname

    const thankYouPages = await storage.get('thankYouPages')

    if (!thankYouPages || !thankYouPages.length || !(thankYouPages instanceof Uint8Array)) return falseResponse

    const { matched, match } = searchCompressed(thankYouPages, query, true, true)

    if (!matched) {
        return falseResponse
    }

    await analytics({ type: 'thank_you_page', page: url, entry: match }).catch(() => { })

    return {
        matched,
        match,
    }
}

export default checkThankYouPage;