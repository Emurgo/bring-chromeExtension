<img src="https://avatars.githubusercontent.com/u/122225882?s=96&v=4"/>
<br><br>
<h1 align="center">@bringweb3/chrome-extension-kit</h1>

## Table of content
- [Table of content](#table-of-content)
- [Description](#description)
- [Prerequisites](#prerequisites)
- [Installing](#installing)
  - [Package](#package)
  - [Manifest](#manifest)
- [Importing](#importing)
- [Example](#example)
  - [background.js](#backgroundjs)
  - [contentScript.js](#contentscriptjs)

## Description
This integration kit is designed to enhance existing Chrome extensions by adding functionality that enables automatic crypto cashback on online purchases.

This kit consists of a set of JavaScript files that crypto outlets can integrate into their crypto wallet extensions. This integration facilitates a seamless addition of cashback features, leveraging cryptocurrency transactions in the context of online shopping.

When a user visits supported online retailer websites, the Crypto Cashback system determines eligibility for cashback offers based on the user's location and the website's relevance.

## Prerequisites

- Node.js >= 14
- Chrome extension manifest >= V3 with required permissions
- Obtain an identifier key from Bringweb3
- Provide a specific logo for the specific outlet

##  Installing

### Package
Using npm:
```bash
$ npm install @bringweb3/chrome-extension-kit
```

Using yarn:

```bash
$ yarn add @bringweb3/chrome-extension-kit
```

Using pnpm:

```bash
$ pnpm add @bringweb3/chrome-extension-kit
```

### Manifest

Include this configuration inside your `manifest.json` file:

```json
  "permissions": [
    "storage",
    "tabs",
    "alarms"
  ],
  "content_scripts": [
    {
      "matches": [
        "<all_urls>"
      ],
      "js": [
        "contentScript.js" // The name of the file importing the bringContentScriptInit
      ]
    }
  ],
  "host_permissions": [
    "https://*.bringweb3.io/*"
  ]
```

Once the package is installed, you can import the library using `import` or `require` approach:


## Importing

```js
import { bringInitBackground } from '@bringweb3/chrome-extension-kit';
```

## Example

### background.js

```js

import { bringInitBackground } from '@bringweb3/chrome-extension-kit';

bringInitBackground({
    identifier: process.env.PLATFORM_IDENTIFIER, // The identifier key you obtained from Bringweb3
    apiEndpoint: 'sandbox', // 'sandbox' || 'prod'
    cashbackPagePath: '/wallet/cashback' // The relative path to your Cashback Dashboard if you have one inside your extension
})
```

### contentScript.js

```js 
import { bringInitContentScript } from "@bringweb3/chrome-extension-kit";

bringInitContentScript({
    iframeEndpoint: process.env.IFRAME_ENDPOINT,
    getWalletAddress: async () => await new Promise(resolve => setTimeout(() => resolve('<USER_WALLET_ADDRESS>'), 200)),// Async function that returns the current user's wallet address
    promptLogin: () => {...}, // Function that prompts a UI element asking the user to login
    walletAddressListeners: ["customEvent:addressChanged"], // A list of custom events that dispatched when the user's wallet address had changed
    customTheme: { // All optional
        fontUrl: 'https://fonts.googleapis.com/css2?family=Matemasie&display=swap',
        fontFamily: "'Matemasie', system-ui",

        popupBg: "#192E34",
        popupShadow: "",

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
```