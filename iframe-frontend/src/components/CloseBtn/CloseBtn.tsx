import styles from './styles.module.css'
import { sendMessage, ACTIONS } from '../../utils/sendMessage'
import { useGoogleAnalytics } from '../../hooks/useGoogleAnalytics'

const CloseBtn = () => {
    const { sendGaEvent } = useGoogleAnalytics()

    const close = () => {
        sendMessage({ action: ACTIONS.CLOSE })
        sendGaEvent('popup_close', {
            category: 'user_action',
            action: 'click',
            details: 'Extension'
        })
    }

    return (
        <button
            onClick={close}
            className={styles.btn}
        >
            <div
                className={styles.icon}
            />
        </button>
    )
}

export default CloseBtn