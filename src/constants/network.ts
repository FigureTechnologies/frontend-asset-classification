export const NETWORK: 'testnet' | 'mainnet' = 'testnet'

export const PRODUCTION = NETWORK as string == 'mainnet'

export const GRPC_URL = PRODUCTION ? 'https://wallet.provenance.io/proxy' : 'https://wallet.test.provenance.io/proxy'
// export const GRPC_URL = 'http://localhost:8080'
export const WALLET_URL = PRODUCTION ? 'https://wallet.provenance.io' : 'https://wallet.test.provenance.io'