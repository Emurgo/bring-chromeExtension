import styles from './styles.module.css'
import Markdown from 'react-markdown'
import CloseBtn from '../CloseBtn/CloseBtn'
import PlatformLogo from '../PlatformLogo/PlatformLogo'
import splitWordMaxFive from '../../utils/splitWordMaxFive'

interface ActivateProps {
    redirectUrl: string
    retailerMarkdown: string
    generalMarkdown: string
    platformName: string
    walletAddress: WalletAddress
}

const Activate = ({ redirectUrl, retailerMarkdown, generalMarkdown, platformName, walletAddress }: ActivateProps) => {

    return (
        <div className={styles.container}>
            <CloseBtn />
            <div className={styles.wallet_container}>
                {walletAddress ? <div className={styles.wallet}>{splitWordMaxFive(walletAddress)}</div> : null}
            </div>
            <div className={styles.subcontainer}>
                <PlatformLogo
                    platformName={platformName}
                />
                <p className={styles.p}>Once your purchase is approved, you'll be notified.<br />It can take up to <b><u>48 hours.</u></b></p>
            </div>
            <Markdown className={styles.markdown}>
                {`${retailerMarkdown}${generalMarkdown}`}
            </Markdown>
            <a
                className={styles.activate_btn}
                href={redirectUrl}
                target='_top'
            >Activate</a>
        </div>
    )
}

export default Activate