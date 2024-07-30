interface Props {
    walletAddressListeners: string[],
    getWalletAddress: () => Promise<WalletAddress>
    iframeEl: IFrame
}

const startListenersForWalletAddress = ({ walletAddressListeners, getWalletAddress, iframeEl }: Props) => {
    for (let i = 0; i < walletAddressListeners.length; i++) {
        const eventName = walletAddressListeners[i]
        if (!eventName) continue
        window.addEventListener(eventName, async (e) => {
            console.log('NEW EVENT');
            // console.log(e.detail);


            if (!iframeEl) {
                iframeEl = document.querySelector('#bringweb3-iframe')
                if (!iframeEl) return
            }
            if (!iframeEl.contentWindow) {
                console.log('No contentWindow');
                return
            }
            const address = await getWalletAddress()
            console.log({ address });

            iframeEl.contentWindow.postMessage({ action: 'WALLET_ADDRESS_UPDATE', walletAddress: address }, '*')
        });
    }
}

export default startListenersForWalletAddress;