import styles from './styles.module.css'
import activate from '../../api/activate'
import { sendMessage, ACTIONS } from '../../utils/sendMessage'

interface OfferProps {
    info: Info | null
    nextFn: () => void
    setRedirectUrl: (url: string) => void
}

const Offer = ({ info, nextFn, setRedirectUrl }: OfferProps) => {

    const activateAction = async () => {
        try {
            if (!info?.walletAddress || !info.platformName || !info.retailerId) return
            const res = await activate({
                walletAddress: info.walletAddress || '',
                platformName: info.platformName || '',
                retailerId: info.retailerId || '',
                url: info.url || '',
                tokenSymbol: 'AURORA'
            })
            if (res.status === 200) {
                setRedirectUrl(res.url)
                nextFn()
                console.log(res);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const optOut = () => {
        sendMessage({ action: ACTIONS.OPT_OUT, time: 5 * 1000 * 60 })
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
            <h1 className={styles.h1}>BRINGWEB3</h1>
            {/* <img
                src={info.iconUrl}
                alt="brand logo"
                width={58}
            /> */}
            <div className={styles.details}>
                {info?.walletAddress ? <div>walletAddress: {splitWordMaxFive(info.walletAddress)}</div> : null}
                {info?.platformName ? <div>platformName: {info.platformName}</div> : null}
                {info?.retailerId ? <div>retailerId: {info.retailerId}</div> : null}
                {info?.url ? <div>url: <a className={styles.link} target='_blank' href={info.url}>Link</a></div> : null}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
                <button onClick={activateAction} className={styles.btn}>Yes</button>
                <button onClick={optOut}>Opt-out</button>
            </div>
        </div>
    )
}

export default Offer