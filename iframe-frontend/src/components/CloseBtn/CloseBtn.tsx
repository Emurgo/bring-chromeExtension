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
            <img
                src="/icons/x-mark.svg"
                width={16}
                height={16}
                alt="x mark"
            />
        </button>
    )
}

export default CloseBtn