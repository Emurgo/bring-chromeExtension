'use strict';
import { bringInitBackground } from '@bringweb3/chrome-extension-kit'

bringInitBackground({
    identifier: process.env.PLATFORM_IDENTIFIER,
    apiEndpoint: 'sandbox', // 'sandbox' || 'prod'
    // whitelistEndpoint: 'https://media.bringweb3.io/tests/redirects.json',
    isEnabledByDefault: false,
    cashbackPagePath: '/main_window.html#/cashback',
    showNotifications: false,
    notificationCallback: () => { console.log('notificationCallback running from the extension') }
})


// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     console.log(message);

//     if (message.action === "openWindow") {
//         chrome.windows.create({
//             url: "login.html",
//             type: "popup",
//             width: 800,
//             height: 600
//         });
//     }
// });