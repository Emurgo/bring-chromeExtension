import styles from './styles.module.css'
import activate from '../../api/activate'
import OptOut from '../OptOut/OptOut'
import { useState } from 'react'
import CryptoSymbolSelect from '../CryptoSymbolSelect/CryptoSymbolSelect'
import CloseBtn from '../CloseBtn/CloseBtn'
import PlatformLogo from '../PlatformLogo/PlatformLogo'
import { sendMessage, ACTIONS } from '../../utils/sendMessage'

interface OfferProps {
    info: Info
    nextFn: () => void
    closeFn: () => void
    setRedirectUrl: (url: string) => void
}

const Offer = ({ info, nextFn, setRedirectUrl, closeFn }: OfferProps) => {
    const [tokenSymbol, setTokenSymbol] = useState(info.cryptoSymbols[0])
    const [optOutOpen, setOptOutOpen] = useState(false)

    const activateAction = async () => {
        try {
            const { platformName, retailerId, url } = info
            let { walletAddress } = info
            if (!walletAddress) {
                sendMessage({ action: ACTIONS.PROMPT_LOGIN })
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

    const splitWordMaxFive = (word: string): string => {
        if (word.length <= 10) {
            const middleIndex = Math.ceil(word.length / 2);
            return `${word.slice(0, middleIndex)}...${word.slice(middleIndex)}`
        }
        return `${word.slice(0, 5)}...${word.slice(-5)}`
    }

    return (
        <div className={styles.container}>
            <CloseBtn />
            <div className={styles.wallet_container}>
                {info?.walletAddress ? <span className={styles.wallet}>{splitWordMaxFive(info.walletAddress)}</span> : null}
            </div>
            <PlatformLogo
                platformName={info.platformName}
            />
            <div className={styles.details}>
                <h2 className={styles.subtitle}>Earn Crypto Cashback</h2>
                <span>{`Receive up to ${parseFloat(info.maxCashback)}${info?.cashbackSymbol} of your total spent in `}
                    <CryptoSymbolSelect
                        options={info.cryptoSymbols}
                        select={tokenSymbol}
                        set={setTokenSymbol}
                    />
                </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
                <button onClick={activateAction} className={styles.btn}>Yes</button>
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