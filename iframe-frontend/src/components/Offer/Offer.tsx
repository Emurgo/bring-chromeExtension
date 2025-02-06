import styles from './styles.module.css'

import { useCallback, useEffect, useState } from 'react'
import { useGoogleAnalytics } from '../../hooks/useGoogleAnalytics'
import OptOut from '../OptOut/OptOut'
import activate from '../../api/activate'
import CryptoSymbolSelect from '../CryptoSymbolSelect/CryptoSymbolSelect'
import CloseBtn from '../CloseBtn/CloseBtn'
import PlatformLogo from '../PlatformLogo/PlatformLogo'
import SwitchBtn from '../SwitchBtn/SwitchBtn'
import { sendMessage, ACTIONS } from '../../utils/sendMessage'
import splitWordMaxFive from '../../utils/splitWordMaxFive'
import LoadingOverlay from '../LoadingOverlay/LoadingOverlay'
import { useRouteLoaderData } from 'react-router-dom'
import toCaseString from '../../utils/toCaseString'
import { useWalletAddress } from '../../hooks/useWalletAddress'

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
    const { iconsPath, textMode } = useRouteLoaderData('root') as LoaderData
    const [tokenSymbol, setTokenSymbol] = useState(info.cryptoSymbols[0])
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
                tokenSymbol
            })
            if (res.status !== 200) throw `Got ${res.status} status`

            setRedirectUrl(res.url)
            nextFn()
        } catch (error) {
            console.error(error);
        }
    }, [info, walletAddress, tokenSymbol, setRedirectUrl, nextFn])

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
            <PlatformLogo
                platformName={info.platformName}
            />
            <div className={styles.details}>
                <div className={styles.subtitle_container}>
                    <img src={`${iconsPath}/coins.svg`} alt="cashback icon" />
                    <h2 className={styles.subtitle}>Earn Crypto Cashback</h2>
                </div>
                <span className={styles.sm_txt}>Buy with any card and earn up to <span className={styles.cashback_amount}>{formatCashback(+info.maxCashback, info.cashbackSymbol, info.cashbackCurrency)}</span> in
                    <CryptoSymbolSelect
                        options={info.cryptoSymbols}
                        select={tokenSymbol}
                        set={setTokenSymbol}
                    />
                </span>
            </div>
            <div className={styles.action_container}>
                <button
                    onClick={handleFirstClick}
                    className={styles.btn}
                    disabled={status !== 'idle'}
                >
                    {toCaseString("Let's go", textMode)}
                </button>
                <div className={styles.btns_container}>
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
                    <button
                        className={styles.action_btn}
                        onClick={() => setOptOutOpen(true)}
                    >
                        {toCaseString("Turn off", textMode)}
                    </button>
                </div>
            </div>
            <LoadingOverlay
                open={['waiting', 'switch'].includes(status)}
            />
            <OptOut
                open={optOutOpen}
                onClose={() => setOptOutOpen(false)}
            />
        </div >
    )
}

export default Offer