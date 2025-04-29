import { FC, createContext, useEffect, ReactNode, useCallback, useRef } from 'react';
import ReactGA from 'react-ga4';
import { TEST_ID } from '../config';
import { VariantKey } from '../utils/ABTest/ABTestVariant';
import analytics from '../api/analytics';
import { useWalletAddress } from '../hooks/useWalletAddress';

type EventName = 'retailer_shop' | 'popup_close' | 'opt_out' | 'retailer_activation' | 'page_view'

interface GAEvent {
    category: "user_action" | "system";
    action?: "click" | "input" | "select" | "request";
    details?: string;
    process?: "activate" | "initiate" | "submit";
}

interface BackendEvent {
    category?: "user_action" | "system";
    action?: "click" | "input" | "select" | "request";
    details?: unknown;
    process?: "activate" | "initiate" | "submit";
}


export const GoogleAnalyticsContext = createContext<GoogleAnalyticsContextType | undefined>(undefined);

interface Props {
    measurementId: string
    children: ReactNode
    platform: string
    userId: string | undefined
    testVariant: VariantKey
    retailerName: string | undefined
    location: string
    flowId: string
}

export const GoogleAnalyticsProvider: FC<Props> = ({ measurementId, children, platform, testVariant, userId, retailerName, location, flowId }) => {
    const effectRan = useRef(false)
    const { walletAddress } = useWalletAddress()

    const sendBackendEvent = useCallback(async (name: EventName, event: BackendEvent) => {
        const backendEvent: Parameters<typeof analytics>[0] = {
            ...event,
            type: name,
            platform,
            testId: TEST_ID,
            testVariant,
            flowId,
        }

        if (retailerName) backendEvent.retailer = retailerName
        if (walletAddress) backendEvent.walletAddress = walletAddress
        if (userId) backendEvent.userId = userId

        try {
            return await analytics(backendEvent)
        } catch (error) {
            console.error('BRING: Error sending analytics event', error)
            return { success: false, error }
        }
    }, [flowId, platform, retailerName, testVariant, userId, walletAddress])

    useEffect(() => {
        if (ReactGA.isInitialized && measurementId) return;

        ReactGA.initialize(measurementId, {
            gaOptions: {
                storage: 'none',
                storeGac: false,
                cookieFlags: 'SameSite=None;Secure'
            },
            gtagOptions: {
                anonymize_ip: true,
                cookie_update: false,
                platform,
                testId: TEST_ID,
                testVariant,
                source: 'extension',
                walletAddress
            }
        });

    }, [measurementId, platform, testVariant, walletAddress]);

    useEffect(() => {
        if (window.origin.includes('localhost')) {
            return
        }

        if (effectRan.current) return

        const details: { [key: string]: string } = {
            pageLocation: window.location.href,
            pagePath: window.location.pathname,
            pageTitle: document.title,
            parentLocation: location
        }
        if (retailerName) details.retailer = retailerName

        sendBackendEvent('page_view', {
            category: 'system',
            details
        })

        effectRan.current = true
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sendPageViewEvent = (): void => {

        if (window.origin.includes('localhost')) {
            return
        }
        if (!ReactGA.isInitialized) {
            console.warn('BRING: Google Analytics is not initialized');
            return
        }
        ReactGA.send({
            hitType: 'pageview',
            page_location: window.location.href,
            page_path: window.location.pathname,
            page_title: document.title,
            retailer: retailerName
        });
    };

    const sendGaEvent = async (name: EventName, event: GAEvent, disableGA: boolean = false): Promise<void> => {

        if (window.origin.includes('localhost')) return

        await sendBackendEvent(name, event)

        if (!ReactGA.isInitialized) {
            console.warn('BRING: Google Analytics is not initialized');
            return
        }

        if (disableGA) return

        const params: { [key: string]: unknown } = {
            ...event,
            platform,
            testId: TEST_ID,
            testVariant,
            source: 'extension'
        }

        if (walletAddress) params.walletAddress = walletAddress
        ReactGA.event(name, params)
        return
    };

    return (
        <GoogleAnalyticsContext.Provider value={{ sendGaEvent, sendPageViewEvent }}>
            {children}
        </GoogleAnalyticsContext.Provider>
    );
};