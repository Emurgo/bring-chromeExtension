import { useEffect, useState } from 'react'
import style from './app.module.css'
import { useSearchParams } from './hooks/useSearchParams'
import verify from './api/verify'
import activate from './api/activate'

enum ACTIONS {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE'
}

interface Styles {
  [key: string]: string
}

interface Message {
  action?: ACTIONS
  style?: Styles
}

interface Info {
  walletAddress?: string
  platformName?: string,
  retailerId?: string,
  url?: string
}

const IFRAME_HEIGHT = 400

const iframeStyle: Styles = {
  width: '360px',
  height: `${IFRAME_HEIGHT}px`,
  border: '1px solid white',
  display: 'block',
  top: `calc(50vh - ${IFRAME_HEIGHT / 2}px)`
}

const App = () => {
  const { getParam } = useSearchParams()
  const [info, setInfo] = useState<Info>({})
  const [show, setShow] = useState(false)

  useEffect(() => {
    const verifyAndShow = async () => {
      try {
        const res = await verify(getParam('token'))
        if (res.status !== 200) throw `got ${res.status} code`
        setInfo(res.info)
        setShow(true)
        open()
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }

    verifyAndShow()
  }, [])

  const message = (message: Message) => {
    window.parent.postMessage({ type: 'test', from: 'bringweb3', ...message }, '*')
    console.log(`iframe post a message: ${message.action}`);
  }

  const open = () => {
    message({ action: ACTIONS.OPEN, style: iframeStyle })
  }

  const activateAction = async () => {
    console.log('iframe: activate');

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
      <div style={{ color: 'white' }}>
        {info?.walletAddress ? <div>walletAddress: {info.walletAddress}</div> : null}
        {info?.platformName ? <div>platformName: {info.platformName}</div> : null}
        {info?.retailerId ? <div>retailerId: {info.retailerId}</div> : null}
        {info?.url ? <div>url: {info.url}</div> : null}
      </div>
      <button onClick={activateAction} className={style.btn}>Activate</button>
    </div>
  )
}

export default App
