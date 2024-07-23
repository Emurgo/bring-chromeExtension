import styles from './app.module.css'
import { useEffect, useState } from 'react'
import { useSearchParams } from './hooks/useSearchParams'
import verify from './api/verify'
import { iframeStyle, keyFrames } from './utils/iframeStyles'
import { sendMessage, ACTIONS } from './utils/sendMessage'
import Offer from './components/Offer/Offer'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import Activate from './components/Activate/Activate'

enum STEPS {
  OFFER = 0,
  ACTIVATE = 1
}

const App = () => {
  const { getParam } = useSearchParams()
  const [info, setInfo] = useState<Info | null>(null)
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(STEPS.OFFER)
  const [direction, setDirection] = useState(1)
  const [redirectUrl, setRedirectUrl] = useState('')

  useEffect(() => {
    sendMessage({ action: ACTIONS.ADD_KEYFRAMES, keyFrames })

    const verifyAndShow = async () => {
      try {
        const res = await verify(getParam('token'))
        if (res.status !== 200) throw `got ${res.status} code`
        setInfo(res.info)
        setShow(true)
        open()
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

  // if (!show) return null

  return (
    <>
      <button
        className={styles.xMark}
        onClick={close}
      >X</button>
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
                nextFn={() => {
                  setStep(STEPS.ACTIVATE)
                  setDirection(-1)
                }}
              />
              :
              step === STEPS.ACTIVATE ?
                <Activate
                  redirectUrl={redirectUrl}
                  prevFn={() => {
                    setStep(STEPS.OFFER)
                    setDirection(1)
                  }}
                />
                :
                null
          }

        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default App
