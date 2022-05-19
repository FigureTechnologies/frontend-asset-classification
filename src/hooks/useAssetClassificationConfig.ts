import { useQuery } from "react-query";
import { ASSET_CONTRACT_ALIAS_NAME } from "../constants";
import { AssetClassificationContractService } from "../services";
import { useAssetClassificationService } from "./useAssetClassificationService";
import { useNetworkConfig } from "./useNetworkConfig";

export const useAssetClassificationConfig = () => {
    const networkConfig = useNetworkConfig()
    const service = useAssetClassificationService()
    return useQuery(['network', networkConfig.network, 'asset-classification-config'], async () => {
        console.log('fetching assclassconfig ', networkConfig.grpcUrl)

        return await service.getConfig()
    }, {
        staleTime: Infinity
    })
}