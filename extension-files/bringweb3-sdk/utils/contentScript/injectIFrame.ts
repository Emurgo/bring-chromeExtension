import getQueryParams from "../getQueryParams";
import getVersion from "../getVersion";
interface Query {
    [key: string]: string

}

interface Props {
    query: Query
    theme?: Style
    iframeSrc: string
}

const injectIFrame = ({ query, theme, iframeSrc }: Props): HTMLIFrameElement => {
    const extensionId = chrome.runtime.id;
    const iframeId = `bringweb3-iframe-${extensionId}`;
    const element = document.getElementById(iframeId)
    if (element) return element as HTMLIFrameElement;
    const params = getQueryParams({ query: { ...query, extensionId, v: getVersion() } })
    const customStyles = theme ? `&${getQueryParams({ query: theme, prefix: 't' })}` : ''
    const iframe = document.createElement('iframe');
    iframe.id = iframeId;
    iframe.src = `${iframeSrc}?${params}${customStyles}`;
    iframe.setAttribute('sandbox', "allow-popups allow-scripts allow-same-origin allow-top-navigation-by-user-activation")
    iframe.style.position = "fixed";
    iframe.scrolling = "no";
    iframe.style.overflow = "hidden";
    iframe.style.width = "1px";
    iframe.style.height = "1px";
    iframe.style.right = "8px";
    iframe.style.borderRadius = "10px";
    iframe.style.border = "none";
    iframe.style.cssText += `z-index: 99999999999999 !important;`;
    if (theme?.popupShadow) iframe.style.boxShadow = theme.popupShadow;
    document.documentElement.appendChild(iframe);
    return iframe
}

export default injectIFrame;