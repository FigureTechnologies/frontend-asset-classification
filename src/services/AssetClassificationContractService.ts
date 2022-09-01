import { MsgExecuteContract } from "@provenanceio/wallet-lib/lib/proto/cosmwasm/wasm/v1/tx_pb"
import { PROD_GRPC_URL } from "../constants"
import { TransactionMeta } from "../hooks"
import { AddAssetDefinition, AddAssetVerifier, DeleteAssetDefinition, QueryAssetDefinition, QueryAssetDefinitionResponse, QueryAssetDefinitions, QueryAssetDefinitionsResponse, QueryContractConfig, QueryContractConfigResponse, UpdateAssetDefinition, UpdateAssetVerifier, VerifierDetail } from "../models"
import { WasmService } from "./WasmService"

export class AssetClassificationContractService {
    wasmService = new WasmService(PROD_GRPC_URL)
    contractAddress: string | null = null

    constructor(grpcUrl: string, public aliasName: string) {
        this.wasmService = new WasmService(grpcUrl)
    }

    async getContractAddress(): Promise<string> {
        if (this.contractAddress != null) {
            return this.contractAddress
        }
        this.contractAddress = await this.wasmService.lookupContractByName(this.aliasName)
        return this.contractAddress
    }

    async getConfig(): Promise<QueryContractConfigResponse> {
        return this.wasmService.queryWasmCustom<QueryContractConfig, QueryContractConfigResponse>(await this.getContractAddress(), new QueryContractConfig())
    }

    async listInvoiceAssetDefinitions(): Promise<QueryAssetDefinitionsResponse> {
        return this.wasmService.queryWasmCustom<QueryAssetDefinitions, QueryAssetDefinitionsResponse>(await this.getContractAddress(), new QueryAssetDefinitions())
    }

    async getAddAssetDefinitionMessage(assetDefinition: QueryAssetDefinitionResponse, bindName: boolean, address: string): Promise<TransactionMeta> {
        const contractAddr = await this.getContractAddress()
        const msg = new AddAssetDefinition(assetDefinition)
            .setBindName(bindName)
        const message = new MsgExecuteContract()
            .setMsg(Buffer.from(msg.toJson(), 'utf-8').toString('base64'))
            .setFundsList([])
            .setContract(contractAddr)
            .setSender(address);
        
        return {
            txRaw: Buffer.from(message.serializeBinary()).toString("base64"),
            txPretty: msg.toJsonPretty(),
        };
    }

    async getUpdateAssetDefinitionMessage(assetDefinition: QueryAssetDefinitionResponse, address: string): Promise<TransactionMeta> {
        const contractAddr = await this.getContractAddress()
        const msg = new UpdateAssetDefinition(assetDefinition)
        const message = new MsgExecuteContract()
            .setMsg(Buffer.from(msg.toJson(), 'utf-8').toString('base64'))
            .setFundsList([])
            .setContract(contractAddr)
            .setSender(address);
        
        return {
            txRaw: Buffer.from(message.serializeBinary()).toString("base64"),
            txPretty: msg.toJsonPretty(),
        };
    }

    async getDeleteAssetDefinitionMessage(assetType: string, address: string): Promise<TransactionMeta> {
        const contractAddr = await this.getContractAddress()
        const msg = new DeleteAssetDefinition(assetType)
        const message = new MsgExecuteContract()
            .setMsg(Buffer.from(msg.toJson(), 'utf-8').toString('base64'))
            .setFundsList([])
            .setContract(contractAddr)
            .setSender(address);
        
        return {
            txRaw: Buffer.from(message.serializeBinary()).toString("base64"),
            txPretty: msg.toJsonPretty(),
        };
    }

    async getUpdateAssetVerifierMessage(asset_type: string, verifier: VerifierDetail, address: string): Promise<TransactionMeta> {
        const contractAddr = await this.getContractAddress()
        const msg = new UpdateAssetVerifier()
            .setAssetType(asset_type)
            .setVerifier(verifier)
        const message = new MsgExecuteContract()
            .setMsg(Buffer.from(msg.toJson(), 'utf-8').toString('base64'))
            .setFundsList([])
            .setContract(contractAddr)
            .setSender(address);
        
        return {
            txRaw: Buffer.from(message.serializeBinary()).toString("base64"),
            txPretty: msg.toJsonPretty(),
        };
    }

    async getAddAssetVerifierMessage(asset_type: string, verifier: VerifierDetail, address: string): Promise<TransactionMeta> {
        const contractAddr = await this.getContractAddress()
        const msg = new AddAssetVerifier()
            .setAssetType(asset_type)
            .setVerifier(verifier)
        const message = new MsgExecuteContract()
            .setMsg(Buffer.from(msg.toJson(), 'utf-8').toString('base64'))
            .setFundsList([])
            .setContract(contractAddr)
            .setSender(address);
        
        return {
            txRaw: Buffer.from(message.serializeBinary()).toString("base64"),
            txPretty: msg.toJsonPretty(),
        };
    }
}