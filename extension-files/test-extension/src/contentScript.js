'use strict';
import { initContentScript } from "bringweb3-sdk";

initContentScript({
    getWalletAddress: async () => await new Promise(resolve => setTimeout(() => resolve('0xA67BCD6b66114E9D5bde78c1711198449D104b28'), 200)),
    customTheme: {
        primaryColor: '#FF0000',
    }
});
// TBD:
// initContentScript({ promptLogin: () => { }, walletAddressListener: () => walletAddress || null });

// CSPR GET_WALLET
// getWalletAddress: async () => await window.CasperWalletProvider().getActivePublicKey(),