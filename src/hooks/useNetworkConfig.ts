import { useQuery, useQueryClient } from "react-query"
import { useParams } from "react-router"
import { NetworkOptions, networkOrDefault, PROD_GRPC_URL, PROD_WALLET_URL, TEST_GRPC_URL, TEST_WALLET_URL } from "../constants"

let network: NetworkOptions = 'mainnet' // todo: pull from and save to localstorage?
interface NetworkConfig {
    network: NetworkOptions,
    grpcUrl: string,
    walletUrl: string,
}

const getNetworkConfig = (network: NetworkOptions): NetworkConfig => ({
    network,
    grpcUrl: network === 'mainnet' ? PROD_GRPC_URL : TEST_GRPC_URL,
    walletUrl: network === 'mainnet' ? PROD_WALLET_URL : TEST_WALLET_URL,
})

export const useNetworkConfig = (): NetworkConfig => {
    const { network: paramNetwork } = useParams()
    const initialNetwork = networkOrDefault(paramNetwork)
    const networkConfig = useQuery(['network'], () => getNetworkConfig(network), { staleTime: Infinity, initialData: getNetworkConfig(initialNetwork) })
    return networkConfig.data as NetworkConfig
}

export const useSetNetwork = () => {
    const queryClient = useQueryClient()
    return (newNetwork?: string) => {
        network = networkOrDefault(newNetwork)
        queryClient.invalidateQueries('network')
    }
}