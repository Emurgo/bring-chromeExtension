
interface Styles {
    [key: string]: string
}

const IFRAME_HEIGHT = 350

export const iframeStyle: Styles = {
    animation: 'slideIn .3s ease-in-out',
    width: '540px',
    height: `${IFRAME_HEIGHT}px`,
    // border: '.5px solid gray',
    borderRadius: '20px',
    display: 'block',
    top: '10px'
}

export const keyFrames: Styles[] =
    [
        {
            name: 'slideIn',
            rules:
                `from {
        right: -300px;
      }
      to {
        right: 8px;
      }`
        }
    ]