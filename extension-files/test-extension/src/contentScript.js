'use strict';
import { initContentScript } from "bringweb3-sdk";

initContentScript({
    getWalletAddress: async () => await new Promise(resolve => setTimeout(() => resolve('0xA67BCD6b66114E9D5bde78c1711198449D104b28'), 200)),
    promptLogin: async () => await new Promise(resolve => setTimeout(() => resolve('0xA67BCD6b66114E9D5bde78c1711198449D104b28'), 4000)),
    walletAddressListeners: [
        "casper-wallet:activeKeyChanged",
        "casper-wallet:disconnected",
        "casper-wallet:connected",
        "casper-wallet:unlocked",
        "casper-wallet:locked"
    ],
    customTheme: {
        primaryColor: '#FF0000',
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