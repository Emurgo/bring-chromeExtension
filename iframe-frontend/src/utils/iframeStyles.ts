
interface Styles {
    [key: string]: string
}

const IFRAME_HEIGHT = 400

export const iframeStyle: Styles = {
    animation: 'slideIn .3s ease-in-out',
    width: '600px',
    height: `${IFRAME_HEIGHT}px`,
    // border: '.5px solid gray',
    borderRadius: '4px',
    display: 'block',
    // top: `calc(50vh - ${IFRAME_HEIGHT / 2}px)`,
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