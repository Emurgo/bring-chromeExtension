import styles from './styles.module.css'
import Markdown from 'react-markdown'
import CloseBtn from '../CloseBtn/CloseBtn'
import PlatformLogo from '../PlatformLogo/PlatformLogo'
import splitWordMaxFive from '../../utils/splitWordMaxFive'
import { useGoogleAnalytics } from '../../hooks/useGoogleAnalytics'
import { sendMessage, ACTIONS } from '../../utils/sendMessage'
import { useRouteLoaderData } from 'react-router-dom'
import toCaseString from '../../utils/toCaseString'
import SwitchBtn from '../SwitchBtn/SwitchBtn'

interface ActivateProps {
    redirectUrl: string
    retailerMarkdown: string
    generalMarkdown: string
    platformName: string
    walletAddress: WalletAddress
    retailerName: string
}

const Activate = ({ redirectUrl, retailerMarkdown, generalMarkdown, platformName, retailerName, walletAddress }: ActivateProps) => {
    const { textMode, url } = useRouteLoaderData('root') as LoaderData
    const { sendGaEvent } = useGoogleAnalytics()

    const redirectEvent = () => {
        console.log('POPUP', { url });

        sendMessage({ action: ACTIONS.ACTIVATE, url })
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
                <SwitchBtn />
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