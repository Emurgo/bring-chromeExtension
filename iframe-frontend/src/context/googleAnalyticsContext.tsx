import { FC, createContext, useEffect, ReactNode } from 'react';
import ReactGA from 'react-ga4';
import { TEST_ID } from '../config';
import { VariantKey } from '../utils/ABTest/ABTestVariant';
import analytics from '../api/analytics';

type EventName = 'retailer_shop' | 'popup_close' | 'opt_out' | 'retailer_activation'

interface GAEvent {
    category: "user_action" | "system";
    action?: "click" | "input" | "select" | "request";
    details?: string;
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
    walletAddress: string | undefined
    testVariant: VariantKey
}

export const GoogleAnalyticsProvider: FC<Props> = ({ measurementId, children, platform, walletAddress, testVariant }) => {
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

        // sendPageViewEvent();
    }, [measurementId, platform, testVariant, walletAddress]);

    const sendPageViewEvent = (): void => {
        console.log('IFRAME, PAGE_VIEW');

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

    const sendGaEvent = async (name: EventName, event: GAEvent): Promise<void> => {
        const backendEvent: Parameters<typeof analytics>[0] = {
            type: name,
            ...event,
            platform,
            testId: TEST_ID,
            testVariant,
        }

        if (walletAddress) backendEvent.walletAddress = walletAddress
        try {
            await analytics(backendEvent)
        } catch (error) {
            console.error('BRING: Error sending analytics event', error)
        }
        if (window.origin.includes('localhost')) {
            return
        }
        if (!ReactGA.isInitialized) {
            console.warn('BRING: Google Analytics is not initialized');
            return
        }

        const params: { [key: string]: unknown } = {
            ...event,
            platform,
            testId: TEST_ID,
            testVariant,
            source: 'extension'
        }

        if (walletAddress) params.walletAddress = walletAddress
        ReactGA.event(name, params)
    };

    return (
        <GoogleAnalyticsContext.Provider value={{ sendGaEvent, sendPageViewEvent }}>
            {children}
        </GoogleAnalyticsContext.Provider>
    );
};