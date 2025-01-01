import { useContext } from "react";
import { WalletAddressContext } from "../context/walletAddressContext";

export const useWalletAddress = (): WalletAddressContextType => {
    const context = useContext(WalletAddressContext);
    if (context === undefined) {
        throw new Error('useWalletAddress must be used within a WalletAddressProvider');
    }
    return context;
};