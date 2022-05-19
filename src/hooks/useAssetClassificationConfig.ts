import { useQuery } from "react-query";
import { ASSET_CONTRACT_ALIAS_NAME } from "../constants";
import { AssetClassificationContractService } from "../services";

export const useAssetClassificationConfig = () => useQuery(['asset-classification-config'], async () => {
    const service = new AssetClassificationContractService(ASSET_CONTRACT_ALIAS_NAME)

    return await service.getConfig()
})