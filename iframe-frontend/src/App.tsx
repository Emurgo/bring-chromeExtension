import { useEffect } from 'react'
import style from './app.module.css'

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

const IFRAME_HEIGHT = 200

const iframeStyle: Styles = {
  width: '360px',
  height: `${IFRAME_HEIGHT}px`,
  border: '1px solid white',
  display: 'block',
  top: `calc(50vh - ${IFRAME_HEIGHT / 2}px)`
}

const App = () => {

  const message = (message: Message) => {
    window.parent.postMessage({ type: 'test', from: 'bringweb3', ...message }, '*')
    console.log(`iframe post a message: ${message.action}`);
  }

  const open = () => {
    message({ action: ACTIONS.OPEN, style: iframeStyle })
  }

  useEffect(() => {
    open()
  }, [])

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
      <button onClick={activate} className={style.btn}>Activate</button>
    </div>
  )
}

export default App
