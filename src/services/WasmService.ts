import { QueryClient as WasmQueryClient } from "@provenanceio/wallet-lib/lib/proto/cosmwasm/wasm/v1/query_grpc_web_pb";
import { QuerySmartContractStateRequest } from "@provenanceio/wallet-lib/lib/proto/cosmwasm/wasm/v1/query_pb";
import { QueryClient as NameQueryClient } from "@provenanceio/wallet-lib/lib/proto/provenance/name/v1/query_grpc_web_pb";
import { QueryResolveRequest } from "@provenanceio/wallet-lib/lib/proto/provenance/name/v1/query_pb";
import { PROD_GRPC_URL } from '../constants';

export class WasmService {
    nameQueryClient: NameQueryClient = new NameQueryClient(PROD_GRPC_URL, null)
    wasmQueryClient: WasmQueryClient = new WasmQueryClient(PROD_GRPC_URL, null)
    
    constructor(grpcUrl: string) {
        this.nameQueryClient = new NameQueryClient(grpcUrl, null)
        this.wasmQueryClient = new WasmQueryClient(grpcUrl, null)
    }

    lookupContractByName(name: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.nameQueryClient.resolve(new QueryResolveRequest().setName(name), null, (error, res) => {
                if (error) {
                    reject(new Error(`wasmService.lookupContractByName error: Code: ${error.code} Message: ${error.message}`))
                } else {
                    resolve(res.getAddress())
                }
            })
        })
    }

    queryWasmCustom<T, R>(contractAddress: string, query: T): Promise<R> {
        return new Promise((resolve, reject) => {
            const queryData = Buffer.from(JSON.stringify(query), "utf-8").toString("base64")
            this.wasmQueryClient.smartContractState(new QuerySmartContractStateRequest()
                .setAddress(contractAddress)
                .setQueryData(queryData)
                , null, (error, res) => {
                if (error) {
                    reject(new Error(`wasmService.queryWasmCustom error: Code: ${error.code} Message: ${error.message}`))
                } else {
                    resolve(JSON.parse(Buffer.from(res.getData_asU8()).toString('utf-8')))
                }
            })
        })
    }
}