import styles from './styles.module.css'
import { sendMessage, ACTIONS } from '../../../utils/sendMessage'
import { useGoogleAnalytics } from '../../../hooks/useGoogleAnalytics'
import { useRouteLoaderData } from 'react-router-dom'
import compareVersions from '../../../utils/compareVersions'

interface Props {
    callback?: () => void
}

const DAY_IN_MS = 24 * 60 * 60 * 1000
const THIRTY_MIN_MS = 30 * 60 * 1000

const CloseBtn = ({ callback }: Props) => {
    const { domain, version, variant, iconsPath } = useRouteLoaderData('root') as LoaderData
    const { sendGaEvent } = useGoogleAnalytics()

    const close = async () => {
        await sendGaEvent('popup_close', {
            category: 'user_action',
            action: 'click',
            details: 'extension'
        })
        if (compareVersions(version, '1.2.6') !== 1) {
            sendMessage({ action: ACTIONS.ACTIVATE, url: `https://${domain}` })
        }
        const QUIET_TIME = variant === 'argentControl' ? DAY_IN_MS : THIRTY_MIN_MS
        sendMessage({ action: ACTIONS.CLOSE, domain, time: Date.now() + QUIET_TIME })
    }

    return (
        <button
            onClick={() => {
                close()
                callback && callback()
            }}
            className={styles.btn}
        >
            <img src={`${iconsPath}/x-mark.svg`} alt="exit icon" />
        </button>
    )
}

export default CloseBtn