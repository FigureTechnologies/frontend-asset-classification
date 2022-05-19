import { useCallback } from 'react'
import { useQuery, useQueryClient } from 'react-query'
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