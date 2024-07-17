/*global chrome*/
import style from './app.module.css'

const App = () => {

  const activate = () => {
    window.postMessage({ type: 'test' }, "*");
    console.log(chrome.runtime);

    // chrome.runtime.sendMessage('test')
    console.log('activate parent')
  }

  return (
    <div className={style.container}>
      <h1 className={style.h1}>BRINGWEB3</h1>
      <button onClick={activate} className={style.btn}>Activate</button>
    </div>
  )
}

export default App
