const urlRemoveOptions = ['www.', 'www1.', 'www2.']

const parseUrl = (url: string) => {
    if (!url) return '';

    url = url.split('://').reverse()[0] || '';

    for (const key of urlRemoveOptions) {
        if (url.startsWith(key)) {
            url = url.replace(key, '')
        }
    }
    return url;
}

export default parseUrl;