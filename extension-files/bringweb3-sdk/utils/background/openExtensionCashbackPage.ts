
export const openExtensionCashbackPage = (page: string) => {

    chrome.tabs.create({
        url:page
    });
}