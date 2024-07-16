'use strict';

// Log `title` of current active web page
const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
  `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
);

const handleIframeMessages = event => {
  console.log('BRING EVENT: ', { event });
}

document.addEventListener('message', handleIframeMessages)


const injectIFrame = () => {
  const iframe = document.createElement('iframe');
  iframe.id = "bringweb3-iframe";
  iframe.src = "http://localhost:5173/";
  iframe.style.width = "350px";
  iframe.style.height = "600px";
  iframe.style.position = "fixed";
  iframe.style.right = "16px";
  iframe.style.top = "calc(50vh - 300px)";
  iframe.style.borderRadius = "10px";
  iframe.style.border = "1px solid #ccc";
  iframe.style.cssText += 'z-index: 9999999999 !important;';
  iframe.sandbox = "allow-popups allow-scripts allow-same-origin";
  document.body.insertBefore(iframe, document.body.firstChild);

}


// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // console.log({ request });
  if (request.type === 'INJECT') {
    console.log(`injecting to: `, request.domain);
    injectIFrame();
  }
  sendResponse({ status: 'success' });
  return true;
});
