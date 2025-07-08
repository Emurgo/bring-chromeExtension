// import styles from './styles.module.css'
import { useEffect, useState } from 'react'
import { useRouteLoaderData } from 'react-router-dom'
import Activate from '../../components/Activate/Activate'
import { sendMessage, ACTIONS } from '../../utils/sendMessage'
import { iframeStyle } from '../../utils/iframeStyles'

const Activated = () => {
    const { retailerTermsUrl, generalTermsUrl, platformName } = useRouteLoaderData('root') as LoaderData
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
        <Activate
            retailerMarkdown={retailerMarkdown}
            generalMarkdown={generalMarkdown}
            redirectUrl='dga'
        />
    )
}

export default Activated