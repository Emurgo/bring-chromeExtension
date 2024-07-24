import styles from './styles.module.css'
import activate from '../../api/activate'
import OptOut from '../OptOut/OptOut'
import { useState } from 'react'

interface OfferProps {
    info: Info
    nextFn: () => void
    closeFn: () => void
    setRedirectUrl: (url: string) => void
}

const Offer = ({ info, nextFn, setRedirectUrl, closeFn }: OfferProps) => {

    const [optOutOpen, setOptOutOpen] = useState(false)

    const activateAction = async () => {
        try {
            const res = await activate({
                walletAddress: info.walletAddress,
                platformName: info.platformName,
                retailerId: info.retailerId,
                url: info.url,
                tokenSymbol: 'AURORA'
            })
            if (res.status === 200) {
                setRedirectUrl(res.url)
                nextFn()
            }
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
            <div className={styles.wallet_container}>
                {info?.walletAddress ? <span className={styles.wallet}>{splitWordMaxFive(info.walletAddress)}</span> : null}
            </div>
            <div className={styles.company_name_container}>
                <img
                    src={info?.iconUrl}
                    alt="brand logo"
                    width={48}
                    className={styles.img}
                />
                <h1 className={styles.h1}>{info.name}</h1>
            </div>
            <div className={styles.details}>
                <h2 className={styles.subtitle}>Earn Crypto Cashback</h2>
                <span>{`Receive up to ${parseFloat(info.maxCashback)}${info?.cashbackSymbol} of your total spent in `}<span className={styles.cashback_symbol}>CSPR</span></span>
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