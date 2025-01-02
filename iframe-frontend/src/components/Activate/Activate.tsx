import styles from './styles.module.css'
import Markdown from 'react-markdown'
import CloseBtn from '../CloseBtn/CloseBtn'
import PlatformLogo from '../PlatformLogo/PlatformLogo'
import splitWordMaxFive from '../../utils/splitWordMaxFive'
import { useGoogleAnalytics } from '../../hooks/useGoogleAnalytics'
import { sendMessage, ACTIONS } from '../../utils/sendMessage'
import { useRouteLoaderData } from 'react-router-dom'
import toCaseString from '../../utils/toCaseString'
import { useEffect, useRef } from 'react'
import { useWalletAddress } from '../../hooks/useWalletAddress'
// import SwitchBtn from '../SwitchBtn/SwitchBtn'

interface ActivateProps {
    redirectUrl: string
    retailerMarkdown: string
    generalMarkdown: string
    platformName: string
    retailerName: string
}

const Activate = ({ redirectUrl, retailerMarkdown, generalMarkdown, platformName, retailerName }: ActivateProps) => {
    const { walletAddress } = useWalletAddress()
    const { textMode, url, domain } = useRouteLoaderData('root') as LoaderData
    const { sendGaEvent } = useGoogleAnalytics()
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current === true) return
        sendGaEvent('wallet_connected', {
            category: 'system',
            details: retailerName
        }, true)
        effectRan.current = true
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const redirectEvent = () => {
        sendMessage({ action: ACTIONS.ACTIVATE, url, domain })
        sendGaEvent('retailer_shop', {
            category: 'user_action',
            action: 'click',
            details: retailerName
        })
    }

    return (
        <div className={styles.container}>
            <CloseBtn />
            <div className={styles.top_container}>
                <div className={styles.wallet_container}>
                    <span className={styles.wallet}>{splitWordMaxFive(walletAddress as string)}</span>
                </div>
                {/* <SwitchBtn /> */}
            </div>
            <div className={styles.subcontainer}>
                <PlatformLogo
                    platformName={platformName}
                />
                <p className={styles.p}>Once your purchase is approved, you'll be notified.<br />It can take up to <u className={styles.bold}>48 hours.</u></p>
            </div>
            <Markdown className={styles.markdown}>
                {`${retailerMarkdown}${generalMarkdown}`}
            </Markdown>
            <a
                className={styles.activate_btn}
                onClick={redirectEvent}
                href={redirectUrl}
                target='_top'
            >{toCaseString('Activate', textMode)}</a>
        </div>
    )
}

export default Activate