import styles from './styles.module.css'
import Markdown from 'react-markdown'
interface ActivateProps {
    prevFn: () => void
    redirectUrl: string
    retailerMarkdown: string
    generalMarkdown: string
}

const Activate = ({ redirectUrl, retailerMarkdown, generalMarkdown }: ActivateProps) => {

    return (
        <div className={styles.container}>
            <div className={styles.subcontainer}>
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