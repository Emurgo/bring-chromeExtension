'use strict';
import { bringInitContentScript } from "@bringweb3/sdk";

bringInitContentScript({
    iframeEndpoint: process.env.IFRAME_ENDPOINT,
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
        // fontUrl: 'https://fonts.googleapis.com/css2?family=Matemasie&display=swap',
        // fontFamily: "'Matemasie', system-ui",

        popupBg: "#192E34",

        primaryBtnBg: "linear-gradient(135deg, #5DEB5A 0%, #FDFC47 100%)",
        primaryBtnColor: "#041417",
        primaryBtnBorderColor: "transparent",
        primaryBtnBorderW: "0",
        primaryBtnRadius: "8px",

        secondaryBtnBg: "transparent",
        secondaryBtnColor: "white",
        secondaryBtnBorderColor: "rgba(149, 176, 178, 0.50)",
        secondaryBtnBorderW: "2px",
        secondaryBtnRadius: "8px",

        markdownBg: "#07131766",
        markdownColor: "#DADCE5",
        markdownBorderW: "0",
        markdownRadius: "4px",
        markdownBorderColor: "black",
        markdownScrollbarColor: "#DADCE5",

        walletColor: "white",
        walletBg: "#33535B",
        walletBorderColor: "white",
        walletBorderW: "0",
        walletRadius: "4px",

        detailsBg: "#33535B",
        detailsColor: "white",
        detailsRadius: "8px",
        detailsBorderW: "0",
        detailsBorderColor: "transparent",
        detailsCashbackColor: "linear-gradient(135deg, #5DEB5A 0%, #FDFC47 100%)",

        overlayBg: "#192E34E6",
        overlayColor: "#DADCE5",

        optoutBg: "#192E34",
        optoutColor: "white",
        optoutRadius: "56px",

        closeColor: "#B9BBBF",

        tokenBg: "transparent",
        tokenColor: "#DADCE5",

        notificationBtnColor: "#041417",
        notificationBtnBg: "linear-gradient(135deg, #5DEB5A 0%, #FDFC47 100%)",
        notificationBtnRadius: "8px"
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