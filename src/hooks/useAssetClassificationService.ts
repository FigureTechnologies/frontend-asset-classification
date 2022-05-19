import { useMemo } from "react"
import { AssetClassificationContractService } from "../services"
import { useNetworkConfig } from "./useNetworkConfig"

export const useAssetClassificationService = () => {
    const networkConfig = useNetworkConfig()

    return useMemo(() => {
        console.log('constructing new asset classification service for ', networkConfig.network)
        return new AssetClassificationContractService(networkConfig.grpcUrl)
    }, [networkConfig])
}