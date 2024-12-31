import { FC, createContext, useEffect, ReactNode, useCallback, useRef } from 'react';
import ReactGA from 'react-ga4';
import { TEST_ID } from '../config';
import { VariantKey } from '../utils/ABTest/ABTestVariant';
import analytics from '../api/analytics';

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

interface GoogleAnalyticsContextType {
    sendGaEvent: (name: EventName, event: GAEvent) => void;
    sendPageViewEvent: (path: string) => void;
}

export const GoogleAnalyticsContext = createContext<GoogleAnalyticsContextType | undefined>(undefined);

interface Props {
    measurementId: string
    children: ReactNode
    platform: string
    userId: string | undefined
    walletAddress: string | undefined
    testVariant: VariantKey
}

export const GoogleAnalyticsProvider: FC<Props> = ({ measurementId, children, platform, walletAddress, testVariant, userId }) => {
    const effectRan = useRef(false)

    const sendBackendEvent = useCallback(async (name: EventName, event: BackendEvent) => {
        const backendEvent: Parameters<typeof analytics>[0] = {
            type: name,
            ...event,
            platform,
            testId: TEST_ID,
            testVariant,
        }

        if (walletAddress) backendEvent.walletAddress = walletAddress
        if (userId) backendEvent.userId = userId

        try {
            return await analytics(backendEvent)
        } catch (error) {
            console.error('BRING: Error sending analytics event', error)
            return { success: false, error }
        }
    }, [platform, testVariant, userId, walletAddress])

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

        if (effectRan.current) return
        sendBackendEvent('page_view', {
            category: 'system',
            details: {
                pageLocation: window.location.href,
                pagePath: window.location.pathname,
                pageTitle: document.title
            }
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
            page_title: document.title
        });
    };

    const sendGaEvent = async (name: EventName, event: GAEvent, disableGA: boolean = false): Promise<void> => {

        await sendBackendEvent(name, event)

        if (window.origin.includes('localhost')) return

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