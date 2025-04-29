import removeTrailingSlash from "./background/removeTrailingSlash"

const urlRemoveOptions = ['www.', 'www1.', 'www2.']

const getDomain = (url: string): string => {

    for (const urlRemoveOption of urlRemoveOptions) {
        url = url.replace(urlRemoveOption, '')
    }

    let domain = ''
    try {
        domain = new URL(url).host
    } catch (error) {
        domain = new URL(`https://${url}`).host
    }
    domain = removeTrailingSlash(domain)
    return domain
}

export default getDomain;