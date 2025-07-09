import styles from './styles.module.css'

import { useCallback, useEffect, useState } from 'react'
import { useGoogleAnalytics } from '../../hooks/useGoogleAnalytics'
import OptOut from '../OptOut/OptOut'
import activate from '../../api/activate'
import CloseBtn from '../CloseBtn/CloseBtn'
import SwitchBtn from '../SwitchBtn/SwitchBtn'
import { sendMessage, ACTIONS } from '../../utils/sendMessage'
import splitWordMaxFive from '../../utils/splitWordMaxFive'
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay'
import { useRouteLoaderData } from 'react-router-dom'
import toCaseString from '../../utils/toCaseString'
import { useWalletAddress } from '../../hooks/useWalletAddress'
import formatCashback from '../../utils/formatCashback'
import { motion, AnimatePresence } from 'framer-motion'
import { ACTIVATE_QUIET_TIME } from '../../config'
import parseTime from '../../utils/parseTime'
import { Oval } from 'react-loader-spinner'
import CollaborationLogos from '../CollaborationLogos/CollaborationLogos'

interface BringEventData {
    from: string
    action: string
    walletAddress: WalletAddress
}

interface Props {
    closeFn: () => void
}


const Offer = ({ closeFn }: Props) => {
    const { sendGaEvent } = useGoogleAnalytics()
    const { walletAddress, setWalletAddress } = useWalletAddress()
    const { textMode, flowId, name, platformName, retailerId, url, cryptoSymbols, isTester, version, domain, maxCashback, cashbackSymbol, cashbackCurrency } = useRouteLoaderData('root') as LoaderData
    const [optOutOpen, setOptOutOpen] = useState(false)
    const [isDemo, setIsDemo] = useState(false)
    const [isAddressUpdated, setIsAddressUpdated] = useState(false)
    const [status, setStatus] = useState<'idle' | 'waiting' | 'switch' | 'activating' | 'done'>('idle')

    const activateAction = useCallback(async () => {
        if (!walletAddress) {
            setStatus('waiting')
            sendMessage({ action: ACTIONS.PROMPT_LOGIN })
            return
        }

        setStatus('activating')

        sendGaEvent('retailer_activation', {
            category: 'user_action',
            action: 'click',
            process: 'activate',
            details: name
        })

        const body: Parameters<typeof activate>[0] = {
            walletAddress,
            platformName,
            retailerId,
            url,
            tokenSymbol: cryptoSymbols[0],
            flowId,
        }

        if (isTester && isDemo) {
            body.isDemo = true
        }

        const { status, url: redirectUrl } = await activate(body)

        if (status !== 200) {
            setStatus('idle')
            return
        }

        sendMessage({ action: ACTIONS.ACTIVATE, url, domain, time: parseTime(ACTIVATE_QUIET_TIME, version), redirectUrl })
        sendGaEvent('retailer_shop', {
            category: 'user_action',
            action: 'click',
            details: name
        })

    }, [cryptoSymbols, domain, flowId, isDemo, isTester, name, platformName, retailerId, sendGaEvent, url, version, walletAddress])

    const handleFirstClick = () => {
        setStatus('activating')
        sendGaEvent('retailer_activation', {
            category: 'user_action',
            action: 'click',
            process: 'activate',
            details: name
        })
        activateAction()
    }

    const walletAddressUpdate = useCallback((e: MessageEvent<BringEventData>) => {
        const { walletAddress, action } = e.data
        if (action !== 'WALLET_ADDRESS_UPDATE') return
        setWalletAddress(walletAddress)
        setIsAddressUpdated(true)
    }, [setWalletAddress])

    useEffect(() => {
        if (!isAddressUpdated) return
        if (status === 'waiting') {
            setStatus('done')
            activateAction()
        } else if (status === 'switch') {
            setStatus('idle')
        }
    }, [walletAddress, status, activateAction, isAddressUpdated])

    useEffect(() => {
        if (status === 'done') return

        window.addEventListener("message", walletAddressUpdate)

        return () => {
            window.removeEventListener("message", walletAddressUpdate)
        }
    }, [status, activateAction, walletAddressUpdate])

    return (
        <>
            <CloseBtn />
            <AnimatePresence>
                {
                    !optOutOpen ?
                        <motion.div
                            key="main"
                            className={styles.container}
                            initial={{ x: 0, opacity: 1 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "-100%", opacity: 0 }}
                            transition={{ duration: .2, ease: "easeInOut" }}
                        >
                            {walletAddress ?
                                <div className={styles.top_container}>
                                    <div className={styles.wallet_container}>
                                        <span className={styles.wallet}>{splitWordMaxFive(walletAddress)}</span>
                                    </div>
                                    <SwitchBtn
                                        callback={() => setStatus('switch')}
                                    />
                                    {isTester ?
                                        <div className={styles.demo_container}>
                                            <input
                                                className={styles.demo_checkbox}
                                                type="checkbox"
                                                id='demo'
                                                onChange={(e) => setIsDemo(e.target.checked)}
                                            />
                                            <label className={styles.demo_label} htmlFor="demo">Demo</label>
                                        </div> : null
                                    }
                                </div>
                                :
                                <div className={styles.wallet_spacer} />
                            }
                            <div className={styles.details}>
                                <CollaborationLogos />
                                <div className={styles.details_txt} >
                                    Buy with any card and earn up to <span className={styles.cashback_amount}>{formatCashback(+maxCashback, cashbackSymbol, cashbackCurrency)}</span> in {cryptoSymbols[0]}
                                </div>
                            </div>
                            <div className={styles.action_container}>
                                <button
                                    onClick={handleFirstClick}
                                    className={styles.btn}
                                    disabled={status !== 'idle'}
                                >
                                    {status === 'idle' ?
                                        toCaseString("Activate", textMode)
                                        :
                                        <Oval
                                            visible={true}
                                            height="20"
                                            width="20"
                                            strokeWidth="4"
                                            strokeWidthSecondary="4"
                                            color="var(--primary-btn-f-c)"
                                            secondaryColor=""
                                            ariaLabel="oval-loading"
                                        />
                                    }
                                </button>
                                <div className={styles.btns_container}>
                                    <button
                                        className={styles.action_btn}
                                        disabled={status !== 'idle'}
                                        onClick={() => setOptOutOpen(true)}
                                    >
                                        {toCaseString("Opt out", textMode)}
                                    </button>
                                    <button
                                        className={styles.action_btn}
                                        disabled={status !== 'idle'}
                                        onClick={async () => {
                                            await sendGaEvent('popup_close', {
                                                category: 'user_action',
                                                action: 'click',
                                                details: 'extension'
                                            })
                                            closeFn()
                                        }}
                                    >
                                        {toCaseString("Cancel", textMode)}
                                    </button>
                                </div>
                                <div style={{ textAlign: 'center', color: 'white', textWrap: 'nowrap', fontSize: '14px', lineHeight: '22px' }}>No extra steps required - just shop and get {cryptoSymbols[0]}</div>
                            </div>
                            <LoadingOverlay
                                open={['waiting', 'switch'].includes(status)}
                            />
                        </motion.div>
                        :
                        <motion.div
                            key="optout"
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ duration: .2, ease: "easeInOut" }}
                            className={styles.container}
                        >
                            <OptOut
                                onClose={() => setOptOutOpen(false)}
                            />
                        </motion.div>
                }
            </AnimatePresence>
        </>
    )
}

export default Offer