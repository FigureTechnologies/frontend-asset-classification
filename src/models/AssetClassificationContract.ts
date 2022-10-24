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
    display_name: string,
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
        display_name: assetDefinition.display_name,
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
    /// The Provenance Blockchain bech32 address of the verifier account.
    address: string,
    /// The total amount charged to use the onboarding process this this verifier.
    onboarding_cost: string,
    /// The coin denomination used for this onboarding process.
    onboarding_denom: string,
    /// Each account that should receive fees when onboarding a new scope to the contract.
    /// All of these destinations' individual [fee_amount](super::fee_destination::FeeDestinationV2::fee_amount) properties
    /// should sum to an amount less than or equal to the [onboarding_cost](super::verifier_detail::VerifierDetailV2::onboarding_cost).
    /// Amounts not precisely equal in sum will cause this verifier detail to be considered invalid
    /// and rejected in requests that include it.
    fee_destinations: FeeDestination[],
    /// An optional set of fields that define the verifier, including its name and home URL location.
    entity_detail?: EntityDetail,
    /// Defines the cost to use in place of the root onboarding_cost and fee_destinations when
    /// retrying classification for a failed verification.  If not present, the original values
    /// used for the first verification will be used.
    retry_cost?: OnboardingCost,
    /// An optional set of fields that define behaviors when classification is being run for an
    /// asset that is already classified as a different type.
    subsequent_classification_detail?: SubsequentClassificationDetail,
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

export function newFeeDestination(): FeeDestination {
    return {
        address: '',
        fee_amount: ''
    }
}

export interface OnboardingCost {
    /// The amount of coin to be paid when an asset is sent to the onboard_asset execute function.
    cost: string,
    /// Any specific fee destinations that should be sent to sources other than the selected verifier.
    fee_destinations: FeeDestination[],
}

export function newOnboardingCost(): OnboardingCost {
    return {
        cost: '',
        fee_destinations: [],
    }
}

export interface SubsequentClassificationDetail {
    /// The onboarding cost to use when classifying an asset using the associated verifier after
    /// having already classified it as a different type with the same verifier.  If not set, the
    /// default verifier costs are used.
    cost?: OnboardingCost,
    /// Specifies the asset types that an asset can be to have the subsequent classification cost
    /// apply to them.  If an asset has been classified as any of the types in this list, the cost
    /// will be used.  If the list is supplied as a None variant, any subsequent classifications will
    /// use the cost.  This value will be rejected if it is supplied as an empty vector.
    applicable_asset_types?: string[],
}

export function newSubsequentClassificationDetail(): SubsequentClassificationDetail {
    return {
    }
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

export type QueryAssetDefinitionsResponse = QueryAssetDefinitionResponse[]

export class QueryContractConfig {
    public query_state = {}
}

export interface QueryContractConfigResponse {
    base_contract_name: string,
    admin: string,
    is_test: boolean,
}