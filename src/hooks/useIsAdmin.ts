import { useWalletConnect } from "@provenanceio/walletconnect-js"
import { useAssetClassificationConfig } from "./useAssetClassificationConfig"
import { useNetworkConfig } from "./useNetworkConfig"

export const useIsAdmin = () => {
    const { walletConnectState } = useWalletConnect()
    const { data: config, isLoading } = useAssetClassificationConfig()
    
    return !isLoading && config?.admin === walletConnectState.address
}