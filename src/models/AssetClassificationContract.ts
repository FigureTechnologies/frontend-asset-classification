import { ContractMsg } from "./ContractBase"

export class QueryAssetDefinition {
    public query_asset_definition: {
        asset_type?: String
    } = {}

    constructor(asset_type: string) {
        this.query_asset_definition.asset_type = asset_type
    }
}

export interface QueryAssetDefinitionResponse {
    asset_type: string,
    display_name: string,
    verifiers: VerifierDetail[],
    enabled: boolean,
}

export interface AssetDefinitionInput {
    asset_type: string,
    verifiers: VerifierDetail[],
    enabled: boolean,
    bind_name?: boolean,
}

export function newAssetDefinitionInput(): AssetDefinitionInput {
    return newAssetDefinitionInputFromAssetDefinition(newDefinition())
}

export function newAssetDefinitionInputFromAssetDefinition(assetDefinition: QueryAssetDefinitionResponse): AssetDefinitionInput {
    return {
        asset_type: assetDefinition.asset_type,
        verifiers: assetDefinition.verifiers,
        enabled: assetDefinition.enabled,
        bind_name: true,
    }
}

export function newDefinition(): QueryAssetDefinitionResponse {
    return {
        asset_type: '',
        display_name: '',
        verifiers: [],
        enabled: true,
    }
}

export interface VerifierDetail {
    address: string,
    onboarding_cost: string,
    onboarding_denom: string,
    fee_destinations: FeeDestination[],
    entity_detail?: EntityDetail,
}

export function newVerifier(): VerifierDetail {
    return {
        address: '',
        onboarding_cost: '0',
        onboarding_denom: 'nhash',
        fee_destinations: [],
        entity_detail: newEntityDetail()
    }
}

export function newEntityDetail(): EntityDetail {
    return {
        name: '',
        description: '',
        home_url: '',
        source_url: '',
    }
}

export interface FeeDestination {
    address: string,
    fee_amount: string,
    entity_detail?: EntityDetail,
}

export interface EntityDetail {
    /// A short name describing the entity
    name?: string,
    /// A short description of the entity's purpose
    description?: string,
    /// A web link that can send observers to the organization that the verifier belongs to
    home_url?: string,
    // A web link that can send observers to the source code of the verifier, for increased transparency
    source_url?: string,
}

export class OnboardAsset extends ContractMsg {
    onboard_asset: {
        identifier?: AssetIdentifier,
        asset_type?: string,
        verifier_address?: string,
        access_routes?: AccessRoute[]
    } = {}

    setAssetUuid(asset_uuid: string): OnboardAsset {
        this.onboard_asset.identifier = {
            type: 'asset_uuid',
            value: asset_uuid,
        }
        return this
    }

    setScopeAddress(scope_address: string): OnboardAsset {
        this.onboard_asset.identifier = {
            type: 'scope_address',
            value: scope_address,
        }
        return this
    }
    
    setAssetType(asset_type: string): OnboardAsset {
        this.onboard_asset.asset_type = asset_type
        return this
    }

    setVerifierAddress(verifier_address: string): OnboardAsset {
        this.onboard_asset.verifier_address = verifier_address
        return this
    }

    addAccessRoute(route: string, name?: string): OnboardAsset {
        this.onboard_asset.access_routes = [
            ...(this.onboard_asset.access_routes || []),
            { route, name },
        ]
        return this
    }
}

export class AddAssetDefinition extends ContractMsg {
    add_asset_definition = {
        asset_definition: newAssetDefinitionInput()
    }

    constructor(assetDefinition: QueryAssetDefinitionResponse = newDefinition()) {
        super()
        this.add_asset_definition.asset_definition = newAssetDefinitionInputFromAssetDefinition(assetDefinition)
    }

    setBindName(bindName: boolean): AddAssetDefinition {
        this.add_asset_definition.asset_definition.bind_name = bindName
        return this
    }
}

export class UpdateAssetDefinition extends ContractMsg {
    update_asset_definition = {
        asset_definition: newAssetDefinitionInput()
    }

    constructor(assetDefinition: QueryAssetDefinitionResponse = newDefinition()) {
        super()
        this.update_asset_definition.asset_definition = newAssetDefinitionInputFromAssetDefinition(assetDefinition)
        delete this.update_asset_definition.asset_definition.bind_name
    }
}

export class DeleteAssetDefinition extends ContractMsg {
    delete_asset_definition: {
        asset_type?: String,
    } = {}

    constructor(asset_type: string) {
        super()
        this.delete_asset_definition.asset_type = asset_type
    }
}

export class UpdateAssetVerifier extends ContractMsg {
    update_asset_verifier: {
        asset_type?: string,
        verifier?: VerifierDetail
    } = {}

    setAssetType(asset_type: string): UpdateAssetVerifier {
        this.update_asset_verifier.asset_type = asset_type
        return this
    }

    setVerifier(verifier: VerifierDetail): UpdateAssetVerifier {
        this.update_asset_verifier.verifier = verifier
        return this
    }
}

export class AddAssetVerifier extends ContractMsg {
    add_asset_verifier: {
        asset_type?: string,
        verifier?: VerifierDetail
    } = {}

    setAssetType(asset_type: string): AddAssetVerifier {
        this.add_asset_verifier.asset_type = asset_type
        return this
    }

    setVerifier(verifier: VerifierDetail): AddAssetVerifier {
        this.add_asset_verifier.verifier = verifier
        return this
    }
}

export type AssetIdentifier = AssetUuidAssetIdentifier | ScopeAddressAssetIdentifier

export interface AssetUuidAssetIdentifier {
    type: 'asset_uuid',
    value: string,
}

export interface ScopeAddressAssetIdentifier {
    type: 'scope_address',
    value: string,
}

export interface AccessRoute {
    route: string,
    name?: string
}

export class QueryAssetDefinitions {
    public query_asset_definitions = {}
}

export interface QueryAssetDefinitionsResponse {
    asset_definitions: QueryAssetDefinitionResponse[]
}

export class QueryContractConfig {
    public query_state = {}
}

export interface QueryContractConfigResponse {
    base_contract_name: string,
    admin: string,
    is_test: boolean,
}