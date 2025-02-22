
export const openExtensionCashbackPage = (page: string) => {
    if (!page) {
        return
    }
    chrome.tabs.create({
        url: page
    });
}