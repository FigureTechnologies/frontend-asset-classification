export type NetworkOptions = 'mainnet' | 'testnet'

export const PROD_GRPC_URL = 'https://wallet.provenance.io/proxy'
export const TEST_GRPC_URL = 'https://wallet.test.provenance.io/proxy'

export const PROD_WALLET_URL = 'https://wallet.provenance.io'
export const TEST_WALLET_URL = 'https://wallet.test.provenance.io'

export const networkOrDefault = (network?: string): NetworkOptions => network === 'mainnet' ? 'mainnet' : 'testnet'