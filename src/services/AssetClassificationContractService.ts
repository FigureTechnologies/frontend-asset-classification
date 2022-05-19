import { Coin } from "@provenanceio/wallet-lib/lib/proto/cosmos/base/v1beta1/coin_pb"
import { MsgExecuteContract } from "@provenanceio/wallet-lib/lib/proto/cosmwasm/wasm/v1/tx_pb"
import { AddAssetDefinition, AddAssetVerifier, OnboardAsset, QueryAssetDefinition, QueryAssetDefinitionResponse, QueryAssetDefinitions, QueryAssetDefinitionsResponse, QueryContractConfig, QueryContractConfigResponse, UpdateAssetDefinition, UpdateAssetVerifier, VerifierDetail } from "../models"
import { WasmService } from "./WasmService"

export class AssetClassificationContractService {
    wasmService = new WasmService()
    contractAddress: string | null = null
    aliasName: string

    constructor(aliasName: string) {
        this.aliasName = aliasName
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

    async getInvoiceAssetDefinition(asset_type: string): Promise<QueryAssetDefinitionResponse> {
        return this.wasmService.queryWasmCustom<QueryAssetDefinition, QueryAssetDefinitionResponse>(await this.getContractAddress(), QueryAssetDefinition.fromAssetType(asset_type))
    }

    async getAddAssetDefinitionMessage(assetDefinition: QueryAssetDefinitionResponse, bindName: boolean, address: string) {
        const contractAddr = await this.getContractAddress()
        const message = new MsgExecuteContract()
            .setMsg(Buffer.from(new AddAssetDefinition(assetDefinition)
                .setBindName(bindName)
                .toJson(), 'utf-8').toString('base64'))
            .setFundsList([])
            .setContract(contractAddr)
            .setSender(address);
        
        return Buffer.from(message.serializeBinary()).toString("base64");
    }

    async getUpdateAssetDefinitionMessage(assetDefinition: QueryAssetDefinitionResponse, address: string) {
        const contractAddr = await this.getContractAddress()
        const message = new MsgExecuteContract()
            .setMsg(Buffer.from(new UpdateAssetDefinition(assetDefinition)
                .toJson(), 'utf-8').toString('base64'))
            .setFundsList([])
            .setContract(contractAddr)
            .setSender(address);
        
        return Buffer.from(message.serializeBinary()).toString("base64");
    }

    async getUpdateAssetVerifierMessage(asset_type: string, verifier: VerifierDetail, address: string) {
        const contractAddr = await this.getContractAddress()
        const message = new MsgExecuteContract()
            .setMsg(Buffer.from(new UpdateAssetVerifier()
                .setAssetType(asset_type)
                .setVerifier(verifier)
                .toJson(), 'utf-8').toString('base64'))
            .setFundsList([])
            .setContract(contractAddr)
            .setSender(address);
        
        return Buffer.from(message.serializeBinary()).toString("base64");
    }

    async getAddAssetVerifierMessage(asset_type: string, verifier: VerifierDetail, address: string) {
        const contractAddr = await this.getContractAddress()
        const message = new MsgExecuteContract()
            .setMsg(Buffer.from(new AddAssetVerifier()
                .setAssetType(asset_type)
                .setVerifier(verifier)
                .toJson(), 'utf-8').toString('base64'))
            .setFundsList([])
            .setContract(contractAddr)
            .setSender(address);
        
        return Buffer.from(message.serializeBinary()).toString("base64");
    }
}