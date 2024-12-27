'use strict';
import { bringInitBackground } from '@bringweb3/chrome-extension-kit'

bringInitBackground({
    identifier: process.env.PLATFORM_IDENTIFIER,
    apiEndpoint: 'prod', // 'sandbox' || 'prod'
    cashbackPagePath: '/main_window.html#/cashback'
})
