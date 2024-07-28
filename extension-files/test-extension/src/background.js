'use strict';
import { initBackground } from 'bringweb3-sdk'

initBackground({
    identifier: process.env.PLATFORM_IDENTIFIER,
    getWalletAddress: () => '0xA67BCD6b66114E9D5bde78c1711198449D104b28',
})
