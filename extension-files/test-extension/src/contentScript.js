'use strict';
import { bringInitContentScript } from "@bringweb3/chrome-extension-kit";
const template = {
    // font
    // fontUrl: 'https://fonts.googleapis.com/css2?family=Matemasie&display=swap',
    // fontFamily: "'Matemasie', system-ui",
    // Popup
    popupBg: "#192E34",
    popupShadow: "",
    // Primary button
    primaryBtnBg: "linear-gradient(135deg, #5DEB5A 0%, #FDFC47 100%)",
    primaryBtnFC: "#041417",
    primaryBtnFW: "600",
    primaryBtnFS: "14px",
    primaryBtnBorderC: "transparent",
    primaryBtnBorderW: "0",
    primaryBtnRadius: "8px",
    // Secondary button
    secondaryBtnBg: "transparent",
    secondaryBtnFS: "12px",
    secondaryBtnFW: "500",
    secondaryBtnFC: "white",
    secondaryBtnBorderC: "rgba(149, 176, 178, 0.50)",
    secondaryBtnBorderW: "2px",
    secondaryBtnRadius: "8px",
    // Markdown
    markdownBg: "#07131766",
    markdownFS: "12px",
    markdownFC: "#DADCE5",
    markdownBorderW: "0",
    markdownRadius: "4px",
    markdownBorderC: "black",
    markdownScrollbarC: "#DADCE5",
    // Wallet address
    walletBg: "#33535B",
    walletFS: "10px",
    walletFW: "400",
    walletFC: "white",
    walletBorderC: "white",
    walletBorderW: "0",
    walletRadius: "4px",
    // Details of offering
    detailsBg: "#33535B",
    detailsTitleFS: "15px",
    detailsTitleFW: "600",
    detailsTitleFC: "white",
    detailsSubtitleFS: "14px",
    detailsSubtitleFW: "500",
    detailsSubtitleFC: "#A8ADBF",
    detailsRadius: "8px",
    detailsBorderW: "0",
    detailsBorderC: "transparent",
    detailsAmountFC: "#5DEB5A",
    detailsAmountFW: "700",
    // Overlay
    overlayBg: "#192E34E6",
    overlayFS: "13px",
    overlayFW: "400",
    overlayFC: "#DADCE5",
    loaderBg: "#0A2EC0",
    // Optout \ Turn off
    optoutBg: "#192E34",
    optoutFS: "14px",
    optoutFW: "400",
    optoutFC: "white",
    optoutRadius: "56px",
    // X Button and close buttons
    closeFS: "9px",
    closeFW: "300",
    closeFC: "#B9BBBF",
    // Token name
    tokenBg: "transparent",
    tokenFS: "13px",
    tokenFW: "600",
    tokenFC: "#DADCE5",
    tokenBorderW: "2px",
    tokenBorderC: "#DADCE5",
    // Notification popup
    notificationFS: "14px",
    notificationFW: "500",
    notificationFC: "white",
    notificationBtnBg: "linear-gradient(135deg, #5DEB5A 0%, #FDFC47 100%)",
    notificationBtnFS: "12px",
    notificationBtnFW: "500",
    notificationBtnFC: "#041417",
    notificationBtnBorderW: "0",
    notificationBtnBorderC: "transparent",
    notificationBtnRadius: "8px",
    // Activate title
    activateTitleFS: "14px",
    activateTitleFW: "400",
    activateTitleFC: "#fff",
    activateTitleBoldFS: "14px",
    activateTitleBoldFW: "700",
    activateTitleBoldFC: "#fff",
}
const darkTheme = {
    // font
    fontUrl: 'https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap',
    fontFamily: '"Rubik", sans-serif',
    // Popup
    popupBg: "#15171F",
    popupShadow: "0px 6px 20px 0px rgba(0, 0, 0, 0.10), 0px 1px 8px 0px rgba(0, 0, 0, 0.06)",
    // Primary button
    primaryBtnBg: "#4B6DDE",
    primaryBtnFS: "16px",
    primaryBtnFW: "500",
    primaryBtnFC: "#FFFFFF",
    primaryBtnBorderC: "transparent",
    primaryBtnBorderW: "0",
    primaryBtnRadius: "8px",
    // Secondary button
    secondaryBtnBg: "#15171F",
    secondaryBtnFS: "14px",
    secondaryBtnFW: "500",
    secondaryBtnFC: "#7892E8",
    secondaryBtnBorderC: "#7892E8",
    secondaryBtnBorderW: "2px",
    secondaryBtnRadius: "8px",
    // Markdown
    markdownBg: "#15171F",
    markdownFS: "14px",
    markdownFC: "#E1E6F5",
    markdownBorderW: "1px",
    markdownRadius: "8px",
    markdownBorderC: "#262A38",
    markdownScrollbarC: "#4B5266",
    // Wallet address
    walletBg: "#1F232E",
    walletFS: "12px",
    walletFW: "400",
    walletFC: "#E1E6F5",
    walletBorderC: "transparent",
    walletBorderW: "0",
    walletRadius: "80px",
    // Details of offering
    detailsBg: "#15171F",
    detailsTitleFS: "16px",
    detailsTitleFW: "500",
    detailsTitleFC: "#E1E6F5",
    detailsSubtitleFS: "16px",
    detailsSubtitleFW: "400",
    detailsSubtitleFC: "#E1E6F5",
    detailsRadius: "8px",
    detailsBorderW: "1px",
    detailsBorderC: "#262A38",
    detailsAmountFC: "#7892E8",
    detailsAmountFW: "500",
    // Overlay
    overlayBg: "#1F232ECC",
    overlayFS: "16px",
    overlayFW: "400",
    overlayFC: "#E1E6F5",
    loaderBg: "#4B6DDE",
    // Optout \ Turn off
    optoutBg: "#15171F",
    optoutFS: "16px",
    optoutFW: "400",
    optoutFC: "#E1E6F5",
    optoutRadius: "4px",
    // X Button and close buttons
    closeFS: "12px",
    closeFW: "400",
    closeFC: "#E1E6F5",
    // Token name
    tokenBg: "#1F253B",
    tokenFS: "14px",
    tokenFW: "500",
    tokenFC: "#7892E8",
    tokenBorderW: "0",
    tokenBorderC: "transparent",
    tokenRadius: "80px",
    // Notification popup
    notificationFS: "16px",
    notificationFW: "400",
    notificationFC: "#E1E6F5",
    notificationBtnBg: "#15171F",
    notificationBtnFS: "14px",
    notificationBtnFW: "500",
    notificationBtnFC: "#7892E8",
    notificationBtnBorderW: "2px",
    notificationBtnBorderC: "#7892E8",
    notificationBtnRadius: "8px",
    // Activate title
    activateTitleFS: "16px",
    activateTitleFW: "400",
    activateTitleFC: "#E1E6F5",
    activateTitleBoldFS: "16px",
    activateTitleBoldFW: "500",
    activateTitleBoldFC: "#E1E6F5",
}

const lightTheme = {

    // Popup
    popupBg: "#FFFFFF",
    popupShadow: "0px 6px 20px 0px rgba(0, 0, 0, 0.10), 0px 1px 8px 0px rgba(0, 0, 0, 0.06)",
    // Primary button
    primaryBtnBg: "#4B6DDE",
    primaryBtnFC: "#FFFFFF",
    primaryBtnFW: "500",
    primaryBtnFS: "16px",
    primaryBtnBorderC: "transparent",
    primaryBtnBorderW: "0",
    primaryBtnRadius: "8px",
    // Secondary button
    secondaryBtnBg: "#FFFFFF",
    secondaryBtnFS: "14px",
    secondaryBtnFW: "500",
    secondaryBtnFC: "#4B6DDE",
    secondaryBtnBorderC: "#4B6DDE",
    secondaryBtnBorderW: "2px",
    secondaryBtnRadius: "8px",
    // Markdown
    markdownBg: "#FFFFFF",
    markdownFS: "14px",
    markdownFC: "#242838",
    markdownBorderW: "1px",
    markdownRadius: "8px",
    markdownBorderC: "#DCE0E9",
    markdownScrollbarC: "#A7AFC0",
    // Wallet address
    walletBg: "#EAEDF2",
    walletFS: "12px",
    walletFW: "400",
    walletFC: "#242838",
    walletBorderC: "transparent",
    walletBorderW: "0",
    walletRadius: "80px",
    // Details of offering
    detailsBg: "#FFFFFF",
    detailsTitleFS: "16px",
    detailsTitleFW: "500",
    detailsTitleFC: "#242838",
    detailsSubtitleFS: "16px",
    detailsSubtitleFW: "400",
    detailsSubtitleFC: "#242838",
    detailsRadius: "8px",
    detailsBorderW: "1px",
    detailsBorderC: "#DCE0E9",
    detailsAmountFC: "#4B6DDE",
    detailsAmountFW: "500",
    // Overlay
    overlayBg: "#0000007A",
    overlayFS: "16px",
    overlayFW: "400",
    overlayFC: "#242838",
    loaderBg: "#4B6DDE",
    // Optout \ Turn off
    optoutBg: "#FFFFFF",
    optoutFS: "16px",
    optoutFW: "400",
    optoutFC: "#242838",
    optoutRadius: "4px",
    // X Button and close buttons
    closeFS: "12px",
    closeFW: "400",
    closeFC: "#242838",
    // Token name
    tokenBg: "#E4E8F7",
    tokenFS: "14px",
    tokenFW: "500",
    tokenFC: "#4B6DDE",
    tokenBorderW: "0",
    tokenBorderC: "transparent",
    tokenRadius: "80px",
    // Notification popup
    notificationFS: "16px",
    notificationFW: "400",
    notificationFC: "#242838",
    notificationBtnBg: "#FFFFFF",
    notificationBtnFS: "14px",
    notificationBtnFW: "500",
    notificationBtnFC: "#4B6DDE",
    notificationBtnBorderW: "2px",
    notificationBtnBorderC: "#4B6DDE",
    notificationBtnRadius: "8px",
    // Activate title
    activateTitleFS: "16px",
    activateTitleFW: "400",
    activateTitleFC: "#242838",
    activateTitleBoldFS: "16px",
    activateTitleBoldFW: "500",
    activateTitleBoldFC: "#242838",
}

bringInitContentScript({
    getWalletAddress: async () => await new Promise(resolve => setTimeout(() => resolve(undefined), 200)),
    walletAddressUpdateCallback: (callback) => { callback() },
    promptLogin: async () => await new Promise(resolve => setTimeout(() => resolve('0xA67BCD6b66114E9D5bde78c1711198449D104b28'), 4000)),
    theme: 'dark',
    text: 'lower',
    switchWallet: true
});