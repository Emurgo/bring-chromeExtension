'use strict';
import { bringInitContentScript } from "@bringweb3/sdk";

bringInitContentScript({
    iframeEndpoint: process.env.IFRAME_ENDPOINT,
    getWalletAddress: async () => await new Promise(resolve => setTimeout(() => resolve('addr1q8nj08tfwzjmzrmcl9y25dtpl6wxjdgy59z5mt5lppc88s7y6ald4epue5t6fesxemr3h857wv8aavjht4cpfrc26les2tmzw0'), 200)),
    promptLogin: async () => await new Promise(resolve => setTimeout(() => resolve('addr1q8nj08tfwzjmzrmcl9y25dtpl6wxjdgy59z5mt5lppc88s7y6ald4epue5t6fesxemr3h857wv8aavjht4cpfrc26les2tmzw0'), 4000)),
    walletAddressListeners: [
        "casper-wallet:activeKeyChanged",
        "casper-wallet:disconnected",
        "casper-wallet:connected",
        "casper-wallet:unlocked",
        "casper-wallet:locked"
    ],
    customTheme: {
        primaryColor: '#FF0000',
        secondaryColor: '#00FF00',
        backgroundColor: '#0000FF',
        textColor: '#FFFFFF',
        borderRadius: '10px',
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif'
    }
});
// TBD:
// initContentScript({ promptLogin: () => { }, walletAddressListener: () => walletAddress || null });

// CSPR GET_WALLET
// getWalletAddress: async () => await window.CasperWalletProvider().getActivePublicKey()
// CSPR PROMPT_LOGIN
// getWalletAddress: async () => await window.CasperWalletProvider().requestConnection()

// {
//     "Connected": "casper-wallet:connected",
//     "ActiveKeyChanged": "casper-wallet:activeKeyChanged",
//     "Disconnected": "casper-wallet:disconnected",
//     "TabChanged": "casper-wallet:tabChanged",
//     "Locked": "casper-wallet:locked",
//     "Unlocked": "casper-wallet:unlocked"
// }