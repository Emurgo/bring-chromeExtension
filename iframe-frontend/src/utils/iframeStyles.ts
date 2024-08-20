
interface Styles {
    [key: string]: string
}


export const iframeStyle: Styles = {
    animation: 'slideIn .3s ease-in-out',
    width: '540px',
    height: `356px`,
    borderRadius: '20px',
    display: 'block',
    top: '10px'
}

export const notificationIframeStyle: Styles = {
    animation: 'slideIn .3s ease-in-out',
    width: '400px',
    height: `50px`,
    borderRadius: '10px',
    display: 'block',
    top: '40px'
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