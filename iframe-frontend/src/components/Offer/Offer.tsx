import styles from './styles.module.css'
import activate from '../../api/activate'
import OptOut from '../OptOut/OptOut'
import { useEffect, useState } from 'react'
import CryptoSymbolSelect from '../CryptoSymbolSelect/CryptoSymbolSelect'
import CloseBtn from '../CloseBtn/CloseBtn'
import PlatformLogo from '../PlatformLogo/PlatformLogo'
import { sendMessage, ACTIONS } from '../../utils/sendMessage'
import splitWordMaxFive from '../../utils/splitWordMaxFive'
interface BringEventData {
    from: string
    action: string
    walletAddress: WalletAddress
}

// interface BringEvent {
//     data: BringEventData
// }

interface Props {
    info: Info
    nextFn: () => void
    closeFn: () => void
    setRedirectUrl: (url: string) => void
    setWalletAddress: (walletAddress: WalletAddress) => void
}

const Offer = ({ info, nextFn, setRedirectUrl, closeFn, setWalletAddress }: Props) => {
    const [tokenSymbol, setTokenSymbol] = useState(info.cryptoSymbols[0])
    const [optOutOpen, setOptOutOpen] = useState(false)
    const [waiting, setWaiting] = useState(false)

    const walletAddressUpdate = (e: MessageEvent<BringEventData>) => {
        const { walletAddress, action } = e.data
        if (action !== 'WALLET_ADDRESS_UPDATE') return
        setWalletAddress(walletAddress)
        if (waiting) {
            activateAction()
        }
    }

    useEffect(() => {
        window.addEventListener("message", walletAddressUpdate)

        return () => {
            window.removeEventListener("message", walletAddressUpdate)
        }
    }, [])

    const activateAction = async () => {
        try {
            const { platformName, retailerId, url } = info
            let { walletAddress } = info
            if (!walletAddress) {
                setWaiting(true)
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
    }

    return (
        <div className={styles.container}>
            <CloseBtn />
            <div className={styles.wallet_container}>
                {info?.walletAddress ? <div className={styles.wallet}>{splitWordMaxFive(info.walletAddress)}</div> : null}
            </div>
            <PlatformLogo
                platformName={info.platformName}
            />
            <div className={styles.details}>
                <div className={styles.subtitle_container}>
                    <img src="/icons/coins.svg" alt="coins" height={42} />
                    <h2 className={styles.subtitle}>Earn Crypto Cashback</h2>
                </div>
                <span className={styles.sm_txt}>Receive up to <span className={styles.cashback_amount}>{parseFloat(info.maxCashback)}{info?.cashbackSymbol}</span> of your total spent in
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
                        onClick={closeFn}
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
            <OptOut
                open={optOutOpen}
                onClose={() => setOptOutOpen(false)}
            />
        </div>
    )
}

export default Offer