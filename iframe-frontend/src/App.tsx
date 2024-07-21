import { useEffect, useState } from 'react'
import style from './app.module.css'
import { useSearchParams } from './hooks/useSearchParams'
import { API_URL, API_KEY } from './config'

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

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${API_URL}/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
          },
          body: JSON.stringify({
            token: getParam('token'),
          })
        })
        const json = await res.json()
        if (json.status !== 200) throw `got ${json.status} code`
        setInfo(json.info)
        open()
        console.log(json);
      } catch (error) {
        console.log(error);
      }
    }

    verify()
  }, [])
  const message = (message: Message) => {
    window.parent.postMessage({ type: 'test', from: 'bringweb3', ...message }, '*')
    console.log(`iframe post a message: ${message.action}`);
  }

  const open = () => {
    message({ action: ACTIONS.OPEN, style: iframeStyle })
  }

  const activate = () => {
    console.log('iframe: activate');
  }

  const close = () => {
    message({ action: ACTIONS.CLOSE })
  }

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
      <button onClick={activate} className={style.btn}>Activate</button>
    </div>
  )
}

export default App
