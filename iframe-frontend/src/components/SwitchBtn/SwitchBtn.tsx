import { useRouteLoaderData } from 'react-router-dom'
import styles from './styles.module.css'
import { sendMessage, ACTIONS } from '../../utils/sendMessage'

const SwitchBtn = () => {
    const { iconsPath, switchWallet } = useRouteLoaderData('root') as LoaderData

    const promptLogin = () => {
        sendMessage({ action: ACTIONS.PROMPT_LOGIN })
    }

    if (!switchWallet) {
        return null
    }

    return (
        <button
            className={styles.switch_btn}
            onClick={promptLogin}
        >
            <img
                src={`${iconsPath}/switch.svg`}
                alt="switch icon"
            />
        </button>
    )
}

export default SwitchBtn