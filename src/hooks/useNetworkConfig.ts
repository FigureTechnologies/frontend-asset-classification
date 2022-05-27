import { useCallback } from "react"
import { useQuery, useQueryClient } from "react-query"
import { useParams } from "react-router"
import { MAINNET_ASSET_CONTRACT_ALIAS_NAME, NetworkOptions, networkOrDefault, PROD_GRPC_URL, PROD_WALLET_URL, TESTNET_ASSET_CONTRACT_ALIAS_NAME, TEST_GRPC_URL, TEST_WALLET_URL } from "../constants"

let network: NetworkOptions = 'mainnet' // todo: pull from and save to localstorage?
interface NetworkConfig {
    network: NetworkOptions,
    grpcUrl: string,
    walletUrl: string,
    contractAlias: string,
}

const getNetworkConfig = (network: NetworkOptions): NetworkConfig => ({
    network,
    grpcUrl: network === 'mainnet' ? PROD_GRPC_URL : TEST_GRPC_URL,
    walletUrl: network === 'mainnet' ? PROD_WALLET_URL : TEST_WALLET_URL,
    contractAlias: network === 'mainnet' ? MAINNET_ASSET_CONTRACT_ALIAS_NAME : TESTNET_ASSET_CONTRACT_ALIAS_NAME,
})

export const useNetworkConfig = (): NetworkConfig => {
    const { network: paramNetwork } = useParams()
    const initialNetwork = networkOrDefault(paramNetwork)
    const networkConfig = useQuery(['network'], () => getNetworkConfig(network), { staleTime: Infinity, initialData: getNetworkConfig(initialNetwork) })
    return networkConfig.data as NetworkConfig
}

export const useSetNetwork = () => {
    const queryClient = useQueryClient()
    return useCallback((newNetwork?: string) => {
        network = networkOrDefault(newNetwork)
        queryClient.invalidateQueries('network')
    }, [queryClient])
}