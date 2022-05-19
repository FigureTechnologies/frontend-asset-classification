import { useCallback } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { ASSET_CONTRACT_ALIAS_NAME } from '../constants'
import { AssetClassificationContractService } from '../services'

export const useAssetDefinitions = () => useQuery(['asset-definitions'], async () => {
    const service = new AssetClassificationContractService(ASSET_CONTRACT_ALIAS_NAME)

    return (await service.listInvoiceAssetDefinitions()).asset_definitions
}, {
    staleTime: Infinity
})

export const useInvalidateAssetDefinitions = () => {
    const queryClient = useQueryClient()

    return useCallback(() => {
        queryClient.invalidateQueries('asset-definitions')
    }, [queryClient])
}