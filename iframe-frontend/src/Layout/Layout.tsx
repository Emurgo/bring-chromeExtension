import { Outlet, useLoaderData } from "react-router-dom"
import { GoogleAnalyticsProvider } from "../hooks/useGoogleAnalytics"
import { GA_MEASUREMENT_ID } from "../config"
import useCustomTheme from "../hooks/useCustomTheme"

const Layout = () => {
    useCustomTheme()
    const data = useLoaderData() as Info

    return (
        <>
            <GoogleAnalyticsProvider
                measurementId={GA_MEASUREMENT_ID}
                platform={data.platformName}
                walletAddress={data.walletAddress} // need to make walletAddress dynamically
            >
                <Outlet />
            </GoogleAnalyticsProvider>
        </>
    )
}

export default Layout