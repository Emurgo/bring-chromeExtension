import styles from './styles.module.css'
import { sendMessage, ACTIONS } from '../../utils/sendMessage'

const CloseBtn = () => {

    const close = () => {
        sendMessage({ action: ACTIONS.CLOSE })
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