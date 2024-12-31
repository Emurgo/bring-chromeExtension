import { Outlet, useLoaderData } from "react-router-dom"
import { GoogleAnalyticsProvider } from "../context/googleAnalyticsContext"
import { GA_MEASUREMENT_ID } from "../config"
import useCustomTheme from "../hooks/useCustomTheme"

const Layout = () => {
    useCustomTheme()
    const data = useLoaderData() as LoaderData

    return (
        <>
            <GoogleAnalyticsProvider
                userId={data.userId}
                measurementId={GA_MEASUREMENT_ID}
                platform={data.platformName}
                testVariant={data.variant}
                walletAddress={data.walletAddress}
            >
                <Outlet />
            </GoogleAnalyticsProvider>
        </>
    )
}

export default Layout