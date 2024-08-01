'use strict';
import { bringInitBackground } from '@bringweb3/sdk'

bringInitBackground({
    identifier: process.env.PLATFORM_IDENTIFIER,
    apiEndpoint: 'sandbox' // 'sandbox' || 'prod'
})
