import styles from './styles.module.css'
import { useEffect, useState } from 'react'
import { useRouteLoaderData } from 'react-router-dom'
import { sendMessage, ACTIONS } from '../../utils/sendMessage'
import { iframeStyle } from '../../utils/iframeStyles'
import CloseBtn from '../../components/CloseBtn/CloseBtn'
import { useWalletAddress } from '../../hooks/useWalletAddress'
import splitWordMaxFive from '../../utils/splitWordMaxFive'
import toCapital from '../../utils/toCapital'
import Markdown from 'react-markdown'

const Activated = () => {
    const { retailerTermsUrl, generalTermsUrl, platformName, iconsPath, cryptoSymbols } = useRouteLoaderData('root') as LoaderData
    const { walletAddress } = useWalletAddress()
    const [retailerMarkdown, setRetailerMarkdown] = useState('')
    const [generalMarkdown, setGeneralMarkdown] = useState('')

    const loadMarkdown = async (
        url: string,
        setData: (data: string) => void,
    ) => {
        try {
            const response = await fetch(url)
            const data = await response.text()
            setData(data)
        } catch (error) {
            console.error("Error fetching markdown:", error)
        }
    }

    useEffect(() => {
        sendMessage({ action: ACTIONS.OPEN, style: iframeStyle[platformName.toLowerCase()] || iframeStyle['default'] })
        loadMarkdown(retailerTermsUrl, setRetailerMarkdown)
        loadMarkdown(generalTermsUrl, setGeneralMarkdown)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={styles.container}>
            <CloseBtn
                withTime={false}
            />
            <div className={styles.top_container}>
                {walletAddress ? <div className={styles.wallet_container}>
                    <span className={styles.wallet}>{splitWordMaxFive(walletAddress)}</span>
                </div> : null}
            </div>
            <div className={styles.subcontainer} >
                <img src={`${iconsPath}/activated.svg`} />
                <div className={styles.title}>{cryptoSymbols[0]} cashback activated</div>
                <p className={styles.p}>Reward approval may take up to 48 hours.</p>
                <div className={styles.backed_by}>Backed by {toCapital(platformName)} Wallet</div>
            </div>
            <Markdown className={styles.markdown} >
                {`${retailerMarkdown}${generalMarkdown}`}
            </Markdown>
        </div>
    )
}

export default Activated