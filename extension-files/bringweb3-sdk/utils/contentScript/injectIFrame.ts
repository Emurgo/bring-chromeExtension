import getQueryParams from "../getQueryParams";

interface Query {
    [key: string]: string

}

interface Props {
    query: Query
    theme?: Style
    iframeSrc: string
}

const injectIFrame = ({ query, theme, iframeSrc }: Props): HTMLIFrameElement => {
    const params = getQueryParams({ query })
    const customStyles = theme ? `&${getQueryParams({ query: theme, prefix: 'theme' })}` : ''
    const iframe = document.createElement('iframe');
    iframe.id = "bringweb3-iframe";
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
    document.documentElement.appendChild(iframe);
    return iframe
}

export default injectIFrame;