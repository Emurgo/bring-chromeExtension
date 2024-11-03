'use strict';
import { bringInitBackground } from '@bringweb3/chrome-extension-kit'

bringInitBackground({
    identifier: process.env.PLATFORM_IDENTIFIER,
    apiEndpoint: 'sandbox', // 'sandbox' || 'prod'
    cashbackPagePath: '/wallet/cashback'
})
