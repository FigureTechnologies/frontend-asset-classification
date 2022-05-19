import { useCallback } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { ASSET_CONTRACT_ALIAS_NAME } from '../constants'
import { AssetClassificationContractService } from '../services'
import { useAssetClassificationService } from './useAssetClassificationService'
import { useNetworkConfig } from './useNetworkConfig'

export const useAssetDefinitions = () => {
    const networkConfig = useNetworkConfig()
    const service = useAssetClassificationService()
    return useQuery(['network', networkConfig.network, 'asset-definitions'], async () => {
        return (await service.listInvoiceAssetDefinitions()).asset_definitions
    }, {
        staleTime: Infinity
    })
}

export const useInvalidateAssetDefinitions = () => {
    const queryClient = useQueryClient()

    return useCallback(() => {
        queryClient.invalidateQueries('asset-definitions')
    }, [queryClient])
}