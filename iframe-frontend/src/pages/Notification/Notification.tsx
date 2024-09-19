import { useRouteLoaderData } from 'react-router-dom'
import styles from './styles.module.css'
import PlatformLogo from "../../components/PlatformLogo/PlatformLogo"
import CloseBtn from '../../components/CloseBtn/CloseBtn'
import { useEffect } from 'react'
import { sendMessage, ACTIONS } from '../../utils/sendMessage'
import { notificationIframeStyle } from '../../utils/iframeStyles'
import toCaseString from '../../utils/toCaseString'

interface Notification {
    platformName: string
    cashbackUrl: string
    textMode: 'upper' | 'lower'
    info: {
        new: boolean
        eligible: boolean
    }
}

const Notification = () => {
    const data = useRouteLoaderData('root') as Notification

    useEffect(() => {
        sendMessage({ action: ACTIONS.OPEN, style: notificationIframeStyle })
    }, [])

    return (
        <div className={styles.container}>
            <PlatformLogo
                platformName={data.platformName}
                size='sm'
                width={40}
            />
            <div className={styles.notification_details}>New cashback reward</div>
            <a
                className={styles.link}
                href={data.cashbackUrl}
                target='_blank'
            >
                {toCaseString('Details', data.textMode)}
            </a>
            <CloseBtn />
        </div>
    )
}

export default Notification