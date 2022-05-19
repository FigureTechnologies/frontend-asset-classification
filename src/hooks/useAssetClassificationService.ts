import { useMemo } from "react"
import { AssetClassificationContractService } from "../services"
import { useNetworkConfig } from "./useNetworkConfig"

export const useAssetClassificationService = () => {
    const networkConfig = useNetworkConfig()

    return useMemo(() => {
        return new AssetClassificationContractService(networkConfig.grpcUrl)
    }, [networkConfig])
}