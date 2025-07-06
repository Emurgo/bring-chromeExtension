import styles from './styles.module.css'

import { useCallback, useEffect, useState } from 'react'
import { useGoogleAnalytics } from '../../hooks/useGoogleAnalytics'
import OptOut from '../OptOut/OptOut'
import activate from '../../api/activate'
import CloseBtn from '../CloseBtn/CloseBtn'
import PlatformLogo from '../PlatformLogo/PlatformLogo'
import SwitchBtn from '../SwitchBtn/SwitchBtn'
import { sendMessage, ACTIONS } from '../../utils/sendMessage'
import splitWordMaxFive from '../../utils/splitWordMaxFive'
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay'
import { useRouteLoaderData } from 'react-router-dom'
import toCaseString from '../../utils/toCaseString'
import { useWalletAddress } from '../../hooks/useWalletAddress'
import formatCashback from '../../utils/formatCashback'
import toCapital from '../../utils/toCapital'
import { motion, AnimatePresence } from 'framer-motion'

interface BringEventData {
    from: string
    action: string
    walletAddress: WalletAddress
}

interface Props {
    info: Info
    nextFn: () => void
    closeFn: () => void
    setRedirectUrl: (url: string) => void
}


const Offer = ({ info, nextFn, setRedirectUrl, closeFn }: Props) => {
    const { sendGaEvent } = useGoogleAnalytics()
    const { walletAddress, setWalletAddress } = useWalletAddress()
    const { textMode, flowId, iconUrl, name } = useRouteLoaderData('root') as LoaderData
    const [optOutOpen, setOptOutOpen] = useState(false)
    const [isAddressUpdated, setIsAddressUpdated] = useState(false)
    const [status, setStatus] = useState<'idle' | 'waiting' | 'switch' | 'activating' | 'done'>('idle')

    const activateAction = useCallback(async () => {
        try {
            const { platformName, retailerId, url } = info

            if (!walletAddress) {
                setStatus('waiting')
                sendMessage({ action: ACTIONS.PROMPT_LOGIN })
                return
            }
            const res = await activate({
                walletAddress,
                platformName,
                retailerId,
                url,
                tokenSymbol: info.cryptoSymbols[0],
                flowId
            })
            if (res.status !== 200) throw `Got ${res.status} status`

            setRedirectUrl(res.url)
            nextFn()
        } catch (error) {
            console.error(error);
        }
    }, [info, walletAddress, flowId, setRedirectUrl, nextFn])

    const handleFirstClick = () => {
        setStatus('activating')
        sendGaEvent('retailer_activation', {
            category: 'user_action',
            action: 'click',
            process: 'activate',
            details: info.name
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
    }, [status, activateAction, info, walletAddressUpdate])

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
                                </div>
                                :
                                <div className={styles.wallet_spacer} />
                            }
                            <div className={styles.details}>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'start' }}>
                                    <div className={styles.logo_container} >
                                        <div className={styles.logo_wrapper} >
                                            <img
                                                src={iconUrl}
                                                className={styles.logo}
                                                alt={`${name}-website-icon`}
                                                width={76}
                                                height={76}
                                            />
                                        </div>
                                        <div className={styles.logo_text}>{name}</div>
                                    </div>
                                    <img src="/icons/plus-sign.svg" alt="plus-sign" style={{ marginTop: '32px' }} />
                                    <div className={styles.logo_container} >
                                        <div className={styles.logo_wrapper} >
                                            <PlatformLogo
                                                platformName={info.platformName}
                                                width={49}
                                            />
                                        </div>
                                        <div className={styles.logo_text}>{toCapital(info.platformName)} wallet</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    {/* <div className={styles.subtitle}></div> */}
                                    <span className={styles.sm_txt}><br />Buy with any card and earn up to <span className={styles.cashback_amount}>{formatCashback(+info.maxCashback, info.cashbackSymbol, info.cashbackCurrency)}</span> in {info.cryptoSymbols[0]}
                                        {/* <CryptoSymbolSelect
                        options={info.cryptoSymbols}
                        select={tokenSymbol}
                        set={setTokenSymbol}
                    /> */}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.action_container}>
                                <button
                                    onClick={handleFirstClick}
                                    className={styles.btn}
                                    disabled={status !== 'idle'}
                                >
                                    {toCaseString("Activate", textMode)}
                                </button>
                                <div className={styles.btns_container}>
                                    <button
                                        className={styles.action_btn}
                                        onClick={() => setOptOutOpen(true)}
                                    >
                                        {toCaseString("Opt out", textMode)}
                                    </button>
                                    <button
                                        className={styles.action_btn}
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
                                <div style={{ textAlign: 'center', color: 'white', textWrap: 'nowrap', fontSize: '14px', lineHeight: '22px' }}>No extra steps required - just shop and get {info.cryptoSymbols[0]} in your wallet</div>
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