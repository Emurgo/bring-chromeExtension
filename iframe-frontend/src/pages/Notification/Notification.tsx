import { useRouteLoaderData } from 'react-router-dom'
import styles from './styles.module.css'
import PlatformLogo from "../../components/PlatformLogo/PlatformLogo"
import CloseBtn from '../../components/CloseBtn/CloseBtn'
import { useEffect } from 'react'
import { sendMessage, ACTIONS } from '../../utils/sendMessage'
import { notificationIframeStyle } from '../../utils/iframeStyles'

interface Notification {
    platformName: string
    cashbackUrl: string
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
                width={45}
                height={34}
            />
            <div className={styles.notification_details}>New cashback reward</div>
            <a
                className={styles.link}
                href={data.cashbackUrl}
                target='_blank'
            >
                Details
            </a>
            <CloseBtn />
        </div>
    )
}

export default Notification