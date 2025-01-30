import { useEffect, useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useRouteLoaderData } from 'react-router-dom'
import Offer from '../../components/Offer/Offer'
import Activate from '../../components/Activate/Activate'
import { sendMessage, ACTIONS } from '../../utils/sendMessage'
import { iframeStyle } from '../../utils/iframeStyles'
import compareVersions from '../../utils/compareVersions'

const DAY_IN_MS = 24 * 60 * 60 * 1000
const THIRTY_MIN_MS = 30 * 60 * 1000

enum STEPS {
  OFFER = 0,
  ACTIVATE = 1
}

const Home = () => {
  const info = useRouteLoaderData('root') as LoaderData
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
    sendMessage({ action: ACTIONS.OPEN, style: iframeStyle })
    loadMarkdown(info.retailerTermsUrl, setRetailerMarkdown)
    loadMarkdown(info.generalTermsUrl, setGeneralMarkdown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const close = () => {
    if (compareVersions(info.version, '1.2.6') !== 1) {
      sendMessage({ action: ACTIONS.ACTIVATE, url: `https://${info.domain}` })
    }
    const QUIET_TIME = info.variant === 'control' ? DAY_IN_MS : THIRTY_MIN_MS
    sendMessage({ action: ACTIONS.CLOSE, domain: info.domain, time: Date.now() + QUIET_TIME })
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


  return (
    <>
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
                  retailerName={info.name}
                />
                :
                null
          }

        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default Home
