interface Message {
    action: 'INJECT' | 'GET_WALLET_ADDRESS'
    domain?: string
    token?: string
    iframeUrl?: string
    page?: string
    userId?: string | undefined
}

const sendMessage = (tabId: number, message: Message): Promise<any> => {
    const maxRetries = 5;
    const baseDelay = 1000; // 1 second

    return new Promise((resolve, reject) => {
        const attemptSend = (attempt: number) => {
            // Check if tab exists using a more compatible method
            chrome.tabs.get(tabId, (tab) => {
                if (chrome.runtime.lastError) {
                    // console.warn("Tab no longer exists:", chrome.runtime.lastError.message);
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                // Send message
                chrome.tabs.sendMessage(tabId, { ...message, from: 'bringweb3' }, (response) => {
                    if (chrome.runtime.lastError) {
                        // console.warn(`Attempt ${attempt + 1} failed:`, chrome.runtime.lastError.message);
                        if (attempt < maxRetries - 1) {
                            setTimeout(() => attemptSend(attempt + 1), baseDelay * Math.pow(2, attempt));
                        } else {
                            reject(new Error(chrome.runtime.lastError.message));
                        }
                    } else {
                        // console.log("Message sent successfully");
                        resolve(response);
                    }
                });
            });
        };

        attemptSend(0);
    });
};

export default sendMessage;