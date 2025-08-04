import sendMessage from "./sendMessage";

const closeAllPopups = async (domain: string, currentTabId: number, iframePath?: `/${string}`) => {
    const tabs = await chrome.tabs.query({});

    // All the tab IDs except the current one
    const ids = tabs.map(tab => tab.id).filter(id => id && id !== currentTabId) as number[];

    ids.forEach(id => sendMessage(id, {
        action: 'CLOSE_POPUP',
        reason: 'already_activated',
        path: iframePath || '/',
        domain,
    }));
}

export default closeAllPopups;