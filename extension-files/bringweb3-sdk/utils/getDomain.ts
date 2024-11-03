const urlRemoveOptions = ['www.', 'www1.', 'www2.']

const getDomain = (url: string) => {
    if (!url) return '';

    let newUrl = new URL(url).host;

    for (const key of urlRemoveOptions) {
        if (newUrl.startsWith(key)) {
            newUrl = newUrl.replace(key, '')
        }
    }
    return newUrl;
}

export default getDomain;