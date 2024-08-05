import { useEffect, useState } from 'react'
import { useSearchParams } from './hooks/useSearchParams'
import verify from './api/verify'
import { iframeStyle, keyFrames } from './utils/iframeStyles'
import { sendMessage, ACTIONS } from './utils/sendMessage'
import Offer from './components/Offer/Offer'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import Activate from './components/Activate/Activate'
import useCustomTheme from './hooks/useCustomTheme'
import { GA_MEASUREMENT_ID } from './config'
import { GoogleAnalyticsProvider } from './hooks/useGoogleAnalytics'

enum STEPS {
  OFFER = 0,
  ACTIVATE = 1
}

const App = () => {
  useCustomTheme()
  const { getParam } = useSearchParams()
  const [info, setInfo] = useState<Info | null>(null)
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(STEPS.OFFER)
  const [direction, setDirection] = useState(1)
  const [redirectUrl, setRedirectUrl] = useState('')
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
    sendMessage({ action: ACTIONS.ADD_KEYFRAMES, keyFrames })

    const verifyAndShow = async () => {
      try {
        const res = await verify(getParam('token'))
        if (res.status !== 200) throw `got ${res.status} code`
        setInfo(res.info)
        setShow(true)
        open()

        loadMarkdown(res.info.retailerTermsUrl, setRetailerMarkdown)
        loadMarkdown(res.info.generalTermsUrl, setGeneralMarkdown)
      } catch (error) {
        console.log(error);
      }
    }

    verifyAndShow()
  }, [])

  const open = () => {
    sendMessage({ action: ACTIONS.OPEN, style: iframeStyle })
  }

  const close = () => {
    sendMessage({ action: ACTIONS.CLOSE })
  }

  const setWalletAddress = (walletAddress: WalletAddress): void => {
    if (!info) return
    const tmpInfo = structuredClone(info)
    tmpInfo.walletAddress = walletAddress
    setInfo(tmpInfo)
  }

  const slideVariants: Variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? `100%` : `-100%`,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      y: direction < 0 ? `100%` : `-100%`,
      opacity: 0,
    }),
  };

  if (!show || !info) return null

  return (
    <>
      <GoogleAnalyticsProvider
        measurementId={GA_MEASUREMENT_ID}
        platform={info.platformName}
        walletAddress={info.walletAddress}
      >
        <AnimatePresence
          initial={false}
          custom={direction}
          mode='wait'
        >
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: .2 }}
          >
            {
              step === STEPS.OFFER ?
                <Offer
                  info={info}
                  setRedirectUrl={setRedirectUrl}
                  setWalletAddress={setWalletAddress}
                  closeFn={close}
                  nextFn={() => {
                    setStep(STEPS.ACTIVATE)
                    setDirection(-1)
                  }}
                />
                :
                step === STEPS.ACTIVATE ?
                  <Activate
                    retailerMarkdown={retailerMarkdown}
                    generalMarkdown={generalMarkdown}
                    redirectUrl={redirectUrl}
                    platformName={info.platformName}
                    walletAddress={info.walletAddress}
                    retailerName={info.name}
                  />
                  :
                  null
            }

          </motion.div>
        </AnimatePresence>
      </GoogleAnalyticsProvider>
    </>
  )
}

export default App
