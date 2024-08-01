import styles from './styles.module.css'
import Markdown from 'react-markdown'
import CloseBtn from '../CloseBtn/CloseBtn'
import PlatformLogo from '../PlatformLogo/PlatformLogo'

interface ActivateProps {
    redirectUrl: string
    retailerMarkdown: string
    generalMarkdown: string
    platformName: string
}

const Activate = ({ redirectUrl, retailerMarkdown, generalMarkdown, platformName }: ActivateProps) => {

    return (
        <div className={styles.container}>
            <CloseBtn />
            <div className={styles.subcontainer}>
                <PlatformLogo
                    platformName={platformName}
                />
                <h1 className={styles.title}>Activate Crypto Cashback</h1>
                <p className={styles.p}>Once your purchase is approved, you'll be notified.</p>
                <p className={styles.p}>It can take up to <b><u>24 hours</u></b></p>
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