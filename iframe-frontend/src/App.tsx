import { useEffect, useState } from 'react'
import style from './app.module.css'
import { useSearchParams } from './hooks/useSearchParams'
import verify from './api/verify'
import activate from './api/activate'
import { iframeStyle, keyFrames } from './utils/iframeStyles'

enum ACTIONS {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  ADD_KEYFRAMES = 'ADD_KEYFRAMES'
}

interface Styles {
  [key: string]: string
}

interface Message {
  action?: ACTIONS
  style?: Styles
  keyFrames?: Styles[]
}

interface Info {
  walletAddress?: string
  platformName?: string,
  retailerId?: string,
  url?: string
}

const App = () => {
  const { getParam } = useSearchParams()
  const [info, setInfo] = useState<Info>({})
  const [show, setShow] = useState(false)

  const message = (message: Message) => {
    window.parent.postMessage({ type: 'test', from: 'bringweb3', ...message }, '*')
    // console.log(`iframe post a message: ${message.action}`);
  }

  useEffect(() => {
    message({ action: ACTIONS.ADD_KEYFRAMES, keyFrames })

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
    message({ action: ACTIONS.OPEN, style: iframeStyle })
  }

  const activateAction = async () => {
    const res = await activate({
      walletAddress: info.walletAddress || '',
      platformName: info.platformName || '',
      retailerId: info.retailerId || '',
      url: info.url || '',
      tokenSymbol: 'AURORA'
    })

    console.log(res);
  }

  const close = () => {
    message({ action: ACTIONS.CLOSE })
  }

  if (!show) return null

  return (
    <div className={style.container}>
      <button
        className={style.xMark}
        onClick={close}
      >X</button>
      <h1 className={style.h1}>BRINGWEB3</h1>
      <div className={style.details}>
        {info?.walletAddress ? <div>walletAddress: {info.walletAddress}</div> : null}
        {info?.platformName ? <div>platformName: {info.platformName}</div> : null}
        {info?.retailerId ? <div>retailerId: {info.retailerId}</div> : null}
        {info?.url ? <div>url: <a className={style.link} target='_blank' href={info.url}>Link</a></div> : null}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
        <button onClick={activateAction} className={style.btn}>Activate</button>
        <button>Opt-out</button>
      </div>
    </div>
  )
}

export default App
