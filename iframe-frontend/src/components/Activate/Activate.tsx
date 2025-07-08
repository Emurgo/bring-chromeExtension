import styles from './styles.module.css'
import Markdown from 'react-markdown'
import CloseBtn from '../CloseBtn/CloseBtn'
import PlatformLogo from '../PlatformLogo/PlatformLogo'
import splitWordMaxFive from '../../utils/splitWordMaxFive'
import { useGoogleAnalytics } from '../../hooks/useGoogleAnalytics'
import { sendMessage, ACTIONS } from '../../utils/sendMessage'
import { useRouteLoaderData } from 'react-router-dom'
import toCaseString from '../../utils/toCaseString'
import { useEffect, useRef, useState } from 'react'
import { useWalletAddress } from '../../hooks/useWalletAddress'
import compareVersions from '../../utils/compareVersions'
import { Oval } from 'react-loader-spinner'
import { ACTIVATE_QUIET_TIME } from '../../config'
import parseTime from '../../utils/parseTime'
// import SwitchBtn from '../SwitchBtn/SwitchBtn'

interface ActivateProps {
    redirectUrl: string
    retailerMarkdown: string
    generalMarkdown: string
}


const Activate = ({ redirectUrl, retailerMarkdown, generalMarkdown }: ActivateProps) => {
    const { walletAddress } = useWalletAddress()
    const { textMode, url, domain, version, platformName, name } = useRouteLoaderData('root') as LoaderData
    const { sendGaEvent } = useGoogleAnalytics()
    const [activated, setActivated] = useState(false)
    const effectRan = useRef(false);

    useEffect(() => {
        if (effectRan.current === true) return
        sendGaEvent('wallet_connected', {
            category: 'system',
            details: name
        }, true)
        effectRan.current = true
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const redirectEvent = () => {
        setActivated(true)
        sendMessage({ action: ACTIONS.ACTIVATE, url, domain, time: parseTime(ACTIVATE_QUIET_TIME, version), redirectUrl })
        sendGaEvent('retailer_shop', {
            category: 'user_action',
            action: 'click',
            details: name
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
            {
                compareVersions(version, '1.2.14') !== 1 ?
                    <a
                        className={styles.activate_btn}
                        onClick={redirectEvent}
                        href={redirectUrl}
                        target='_top'
                    >{toCaseString('Activate', textMode)}</a>
                    :
                    <button
                        className={styles.activate_btn}
                        onClick={redirectEvent}
                        disabled={activated}
                    >
                        {
                            !activated ?
                                <>
                                    {toCaseString('Activate', textMode)}
                                </>
                                :
                                <Oval
                                    visible={true}
                                    height="20"
                                    width="20"
                                    strokeWidth="4"
                                    strokeWidthSecondary="4"
                                    color="var(--primary-btn-f-c)"
                                    secondaryColor=""
                                    ariaLabel="oval-loading"
                                />
                        }
                    </button>
            }
        </div>
    )
}

export default Activate