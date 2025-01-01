import { createContext, ReactNode, useState } from "react";

export const WalletAddressContext = createContext<WalletAddressContextType | undefined>(undefined)

interface Props {
    children: ReactNode;
    address: string | undefined;
}

const WalletAddressProvider = ({ children, address }: Props) => {
    const [walletAddress, setWalletAddress] = useState(address)

    return (
        <WalletAddressContext.Provider value={{ walletAddress, setWalletAddress }}>
            {children}
        </WalletAddressContext.Provider>
    )
}

export default WalletAddressProvider;