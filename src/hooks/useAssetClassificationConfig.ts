import { useQuery } from "react-query";
import { useAssetClassificationService } from "./useAssetClassificationService";
import { useNetworkConfig } from "./useNetworkConfig";

export const useAssetClassificationConfig = () => {
    const networkConfig = useNetworkConfig()
    const service = useAssetClassificationService()
    return useQuery(['network', networkConfig.network, 'asset-classification-config'], async () => {
        return await service.getConfig()
    }, {
        staleTime: Infinity
    })
}