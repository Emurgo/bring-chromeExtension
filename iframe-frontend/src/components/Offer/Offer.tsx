import styles from './styles.module.css'
import activate from '../../api/activate'
import OptOut from '../OptOut/OptOut'
import { useEffect, useState } from 'react'
import CryptoSymbolSelect from '../CryptoSymbolSelect/CryptoSymbolSelect'
import CloseBtn from '../CloseBtn/CloseBtn'
import PlatformLogo from '../PlatformLogo/PlatformLogo'
import { sendMessage, ACTIONS } from '../../utils/sendMessage'
import splitWordMaxFive from '../../utils/splitWordMaxFive'
import { useGoogleAnalytics } from '../../hooks/useGoogleAnalytics'
import { Oval } from 'react-loader-spinner'
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
    setWalletAddress: (walletAddress: WalletAddress) => void
}

const Offer = ({ info, nextFn, setRedirectUrl, closeFn, setWalletAddress }: Props) => {
    const { sendGaEvent } = useGoogleAnalytics()
    const [tokenSymbol, setTokenSymbol] = useState(info.cryptoSymbols[0])
    const [optOutOpen, setOptOutOpen] = useState(false)
    const [status, setStatus] = useState<'idle' | 'waiting' | 'done'>('idle')

    const activateAction = async () => {
        try {
            const { platformName, retailerId, url } = info
            let { walletAddress } = info
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
                tokenSymbol
            })
            if (res.status !== 200) throw `Got ${res.status} status`
            sendGaEvent('retailer_activation', {
                category: 'user_action',
                action: 'click',
                process: 'activate',
                details: info.name
            })
            setRedirectUrl(res.url)
            nextFn()
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        if (status === 'done') return

        const walletAddressUpdate = (e: MessageEvent<BringEventData>) => {
            const { walletAddress, action } = e.data
            if (action !== 'WALLET_ADDRESS_UPDATE') return
            setWalletAddress(walletAddress)
            console.log({ waiting: status });

            if (status === 'waiting') {
                console.log('BRING: out of waiting block');
                setStatus('done')
                activateAction()
            }
        }

        window.addEventListener("message", walletAddressUpdate)

        return () => {
            window.removeEventListener("message", walletAddressUpdate)
        }
    }, [status])

    const formatCashback = (amount: number, symbol: string, currency: string) => {
        try {
            if (symbol === '%') {
                return (amount / 100).toLocaleString(undefined, {
                    style: 'percent',
                    maximumFractionDigits: 2
                })
            }

            return amount.toLocaleString(undefined, {
                style: 'currency',
                currency: currency,
                maximumFractionDigits: 2
            })

        } catch (error) {
            return `${symbol}${amount}`
        }
    }

    return (
        <div className={styles.container}>
            <CloseBtn />
            {info?.walletAddress ?
                <div className={styles.wallet_container}>
                    <div className={styles.wallet}>{splitWordMaxFive(info.walletAddress)}</div>
                </div>
                :
                <div className={styles.wallet_spacer} />
            }
            <PlatformLogo
                platformName={info.platformName}
            />
            <div className={styles.details}>
                <div className={styles.subtitle_container}>
                    <img src="/icons/coins.svg" alt="coins" height={42} />
                    <h2 className={styles.subtitle}>Earn Crypto Cashback</h2>
                </div>
                <span className={styles.sm_txt}>Receive up to <span className={styles.cashback_amount}>{formatCashback(+info.maxCashback, info.cashbackSymbol, info.cashbackCurrency)}</span> of your total spent in
                    <CryptoSymbolSelect
                        options={info.cryptoSymbols}
                        select={tokenSymbol}
                        set={setTokenSymbol}
                    />
                </span>
            </div>
            <div className={styles.action_container}>
                <button onClick={activateAction} className={styles.btn}>Let's go</button>
                <div className={styles.btns_container}>
                    <button
                        className={styles.action_btn}
                        onClick={() => {
                            sendGaEvent('popup_close', {
                                category: 'user_action',
                                action: 'click',
                                details: 'extension'
                            })
                            closeFn()
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className={styles.action_btn}
                        onClick={() => setOptOutOpen(true)}
                    >
                        Turn off
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {status === 'waiting' ?
                    <motion.div
                        transition={{ ease: 'easeInOut' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.waiting}>
                        <div className={styles.message}>Log into your wallet to proceed</div>
                        <Oval
                            visible={true}
                            height="60"
                            width="60"
                            strokeWidth="4"
                            strokeWidthSecondary="4"
                            color="var(--loader-bg)"
                            secondaryColor=""
                            ariaLabel="oval-loading"
                        />
                    </motion.div>
                    : null}
            </AnimatePresence>
            <OptOut
                open={optOutOpen}
                onClose={() => setOptOutOpen(false)}
            />
        </div >
    )
}

export default Offer