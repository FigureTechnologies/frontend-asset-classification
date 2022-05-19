import { useQuery, useQueryClient } from "react-query"
import { PROD_GRPC_URL, PROD_WALLET_URL, TEST_GRPC_URL, TEST_WALLET_URL } from "../constants"

let network = 'mainnet' // todo: pull from and save to localstorage?

interface NetworkConfig {
    network: 'mainnet' | 'testnet',
    grpcUrl: string,
    walletUrl: string,
}

export const useNetworkConfig = () => {
    const networkConfig = useQuery(['network'], () => ({
        network,
        grpcUrl: network === 'mainnet' ? PROD_GRPC_URL : TEST_GRPC_URL,
        walletUrl: network === 'mainnet' ? PROD_WALLET_URL : TEST_WALLET_URL,
    } as NetworkConfig), { staleTime: Infinity })
    return networkConfig.data || {
        network: 'mainnet',
        grpcUrl: PROD_GRPC_URL,
        walletUrl: PROD_WALLET_URL
    }
}

export const useSetNetwork = () => {
    const queryClient = useQueryClient()
    return (newNetwork: string) => {
        network = newNetwork
        queryClient.invalidateQueries('network')
    }
}