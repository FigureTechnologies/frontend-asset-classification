import React, { FunctionComponent, useEffect, useState } from "react";
import { useAssetDefinitions, useInvalidateAssetDefinitions, useIsAdmin } from "../../hooks";
import { EntityDetail, FeeDestination, newDefinition, newEntityDetail, newVerifier, QueryAssetDefinitionResponse, VerifierDetail } from "../../models";
import { H3, H4, H5 } from "../Headers";
import styled from 'styled-components'
import { ASSET_CONTRACT_ALIAS_NAME, DARK_BG, DARK_TEXT, LIGHT_TEXT, MSG_EXECUTE_CONTRACT_TYPE, PRIMARY_ACCENT, ROOT_ASSET_CLASSIFICATION_NAME, WHITE } from "../../constants";
import { Input, InputOrDisplay, InputOrDisplayWrapper } from "../Input";
import deepEqual from "deep-equal";
import deepcopy from 'deepcopy'
import { Button } from "../Button";
import { AssetClassificationContractService } from "../../services";
import { useWalletConnect, WINDOW_MESSAGES } from "@provenanceio/walletconnect-js";
import { Any } from "google-protobuf/google/protobuf/any_pb";
import { Modal } from "../Modal";
import { TwoColumnFlex } from "../Layout";

interface AssetTypeConfigProps {

}

export const AssetTypeConfig: FunctionComponent<AssetTypeConfigProps> = () => {
    const { data: assetDefinitions, isLoading, ...rest } = useAssetDefinitions()
    const invalidateAssetDefinitions = useInvalidateAssetDefinitions()
    const isAdmin = useIsAdmin()
    const editable = isAdmin

    const { walletConnectService: wcs, walletConnectState } = useWalletConnect()

    const [addingDefinition, setAddingDefinition] = useState<QueryAssetDefinitionResponse | null>(null)

    const handleTransaction = async (message: string) => {
        console.log("handling transaction", message)
        try {
            await wcs.customAction({
                message: Buffer.from(new Any().setTypeUrl(MSG_EXECUTE_CONTRACT_TYPE).setValue(message).serializeBinary()).toString('base64'),
                description: MSG_EXECUTE_CONTRACT_TYPE,
                method: 'provenance_sendTransaction',
            })
            invalidateAssetDefinitions()
        } catch (e) {
            console.log('err', e)
        }
    }

    useEffect(() => {
        wcs.addListener(WINDOW_MESSAGES.CUSTOM_ACTION_COMPLETE, (res) => {
            console.log('CUSTOM_ACTION_COMPLETE', res)
            invalidateAssetDefinitions()
        })
        wcs.addListener(WINDOW_MESSAGES.CUSTOM_ACTION_FAILED, (res) => {
            console.log('CUSTOM_ACTION_FAILED', res)
        })
        wcs.addListener(WINDOW_MESSAGES.TRANSACTION_COMPLETE, (res) => {
            console.log('TRANSACTION_COMPLETE', res)
        })
        wcs.addListener(WINDOW_MESSAGES.TRANSACTION_FAILED, (res) => {
            console.log('TRANSACTION_FAILED', res)
        })
        console.log('listeners registered')
    }, [])

    const handleAdd = () => {
        setAddingDefinition(newDefinition())
    }

    if (isLoading) {
        <div>Loading</div>
    }

    return <div>
        <H3><TwoColumnFlex>Asset Definitions {editable && <AddButton onClick={handleAdd} title="Add Asset Definition" />}</TwoColumnFlex></H3>
        {assetDefinitions?.map(definition => <AssetDefinition key={definition.asset_type} definition={definition} editable={editable} handleTransaction={handleTransaction} />)}
        {addingDefinition && <Modal requestClose={() => setAddingDefinition(null)}><AssetDefinition definition={addingDefinition} editable creating handleTransaction={() => {/** todo: addOrUpdate here instead of tx */}} /></Modal>}
    </div>
}

const DefinitionWrapper = styled.div`
    padding: 20px;
    margin-bottom: 20px;
    background: ${WHITE};
    border-radius: 5px;
    border: 1px solid ${DARK_BG};
`

const DefinitionDetails = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
`

const AssetVerifiers = styled.div`
`

interface AssetDefinitionProps {
    definition: QueryAssetDefinitionResponse
    editable: boolean
    creating?: boolean
    handleTransaction: (message: string) => any
}

const AssetDefinition: FunctionComponent<AssetDefinitionProps> = ({ definition, editable, creating = false, handleTransaction }) => {

    // todo: edit handler at this level for individual asset definition
    const { walletConnectState } = useWalletConnect()

    const initialState = () => ({
        asset_type: definition.asset_type,
        scope_spec_address: definition.scope_spec_address,
        verifiers: definition.verifiers,
    })

    const [dirty, setDirty] = useState(false)
    const [originalDefinition, setOriginalDefinition] = useState(definition)
    const [verifierToAdd, setVerifierToAdd] = useState<VerifierDetail | null>(null)
    const [bindName, setBindName] = useState(true)

    const [params, setParams] = useState(initialState())

    useEffect(() => {
        setOriginalDefinition(deepcopy(definition))
        setParams(initialState())
    }, [definition])

    const handleChange = () => {
        setDirty(!deepEqual(definition, originalDefinition, { strict: true }))
    }

    const updateParam = (key: string, value: any) => {
        setParams({
            ...params,
            [key]: value
        });
        (definition as any)[key] = value
        handleChange()
    }

    const handleUpdate = async () => {
        const message = await new AssetClassificationContractService(ASSET_CONTRACT_ALIAS_NAME).getUpdateAssetDefinitionMessage(definition, walletConnectState.address)
        handleTransaction(message)
    }

    const handleCreate = async () => {
        const message = await new AssetClassificationContractService(ASSET_CONTRACT_ALIAS_NAME).getAddAssetDefinitionMessage(definition, bindName, walletConnectState.address)
        handleTransaction(message)
    }

    const handleAdd = () => {
        setVerifierToAdd(newVerifier())
    }

    return <DefinitionWrapper>
        <DefinitionDetails>
            <InputOrDisplay label="Asset Type" value={definition.asset_type} editable={creating} onChange={(e) => { updateParam('asset_type', e.target.value) }} />
            <InputOrDisplay label="Scope Spec Address" editable={editable} value={definition.scope_spec_address} onChange={(e) => { updateParam('scope_spec_address', e.target.value) }} />
        </DefinitionDetails>
        <AssetVerifiers>
            <H4>Asset Verifiers {editable && <AddButton onClick={handleAdd} style={{float: 'right'}} title={`Add Asset Verifier for ${params.asset_type}`}/>}</H4>
            {definition.verifiers.length == 0 ? 'No Asset Verifiers' : definition.verifiers.map(verifier => <AssetVerifier key={verifier.address} asset_type={definition.asset_type} verifier={verifier} editable={editable} handleTransaction={handleTransaction} />)}
        </AssetVerifiers>
        {!creating && editable && dirty && <ActionContainer><Button onClick={handleUpdate}>Update</Button></ActionContainer>}
        {verifierToAdd && <Modal requestClose={() => setVerifierToAdd(null)}><AssetVerifier asset_type={definition.asset_type} verifier={verifierToAdd} editable creating handleTransaction={handleTransaction} /> </Modal>}
        {/* {creating && } */}
    </DefinitionWrapper>
}

const AssetVerifierWrapper = styled.div`
    margin-top: 10px;
    &:not(:last-of-type) {
        padding-bottom: 10px;
        border-bottom: 1px solid ${DARK_TEXT};
    }
`

const AssetVerifierDetails = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
`

const ActionContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
`

const IconButtonBody = styled.button`
    border-radius: 50%;
    width: 1.5em;
    height: 1.5em;
    font-size: 1.5rem;
    vertical-align: middle;
    border: none;
    background: ${DARK_BG};
    color: ${LIGHT_TEXT};
    cursor: pointer;
    &:hover {
        opacity: .8;
    }
    &:disabled {
        opacity: .5;
        cursor: not-allowed;
    }
`
const AddButton: FunctionComponent<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => <IconButtonBody {...props}>+</IconButtonBody>
const RemoveButton: FunctionComponent<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => <IconButtonBody {...props}>x</IconButtonBody>

interface AssetVerifierProps {
    asset_type: string,
    verifier: VerifierDetail,
    editable: boolean,
    creating?: boolean,
    handleTransaction: (message: string) => any
}

const AssetVerifier: FunctionComponent<AssetVerifierProps> = ({ asset_type, verifier, editable, creating = false, handleTransaction }) => {
    // todo: edit handler at this level for individual asset verifier update

    const { walletConnectState } = useWalletConnect()

    const [originalVerifier, setOriginalVerifier] = useState(verifier)
    const [dirty, setDirty] = useState(false)
    const [onboardingCost, setOnboardingCost] = useState(`${verifier.onboarding_cost}${verifier.onboarding_denom}`)

    const intitialState = (verifier: VerifierDetail) => ({
        address: verifier.address,
        onboardingCost: `${verifier.onboarding_cost}${verifier.onboarding_denom}`,
        fee_percent: verifier.fee_percent,
        fee_destinations: verifier.fee_destinations
    })

    const [params, setParams] = useState(intitialState(verifier))

    const updateParam = (key: string, value: any) => {
        setParams({
            ...params,
            [key]: value
        });
        (verifier as any)[key] = value
        handleChange()
    }

    useEffect(() => {
        setOriginalVerifier(deepcopy(verifier))
        setParams(intitialState(verifier))
        if (!verifier.entity_detail) {
            verifier.entity_detail = newEntityDetail()
        }
    }, [verifier])

    const handleChange = () => {
        setDirty(!deepEqual(verifier, originalVerifier, { strict: true }))
    }

    const handleCostChange = (cost: string) => {
        const match = /(?<cost>[0-9]*)(?<denom>[a-zA-Z]*)/.exec(cost)
        verifier.onboarding_cost = (match?.groups && match.groups['cost']) || '0'
        verifier.onboarding_denom = (match?.groups && match.groups['denom']) || ''
        setOnboardingCost(`${verifier.onboarding_cost}${verifier.onboarding_denom}`)
        handleChange()
    }

    const handleUpdate = async() => {
        const message = await new AssetClassificationContractService(ASSET_CONTRACT_ALIAS_NAME).getUpdateAssetVerifierMessage(asset_type, verifier, walletConnectState.address)
        handleTransaction(message)
    }

    const handleCreate = async() => {
        const message = await new AssetClassificationContractService(ASSET_CONTRACT_ALIAS_NAME).getAddAssetVerifierMessage(asset_type, verifier, walletConnectState.address)
        handleTransaction(message)
    }

    const addFeeDestination = () => {
        const newFeeDestination = {
            address: '',
            fee_percent: '',
        }
        updateParam('fee_destinations', [...params.fee_destinations, newFeeDestination])
    }

    return <AssetVerifierWrapper>
        <AssetVerifierDetails>
            <InputOrDisplay label="Verifier Address" value={params.address} editable={editable} onChange={(e) => { updateParam('address', e.target.value) }} />
            <InputOrDisplay label="Onboarding Cost" value={onboardingCost} editable={editable} onChange={(e) => handleCostChange(e.target.value)} />
            <InputOrDisplay label="Fee Percent" type="number" min="0" value={params.fee_percent} editable={editable} onChange={(e) => { updateParam('fee_percent', e.target.value) }} />
            <AssetVerifierDetail detail={verifier.entity_detail as EntityDetail} editable={editable} handleChange={handleChange} />
        </AssetVerifierDetails>
        <FeeDestinations>
            <H5>Fee Destinations {editable && <AddButton onClick={addFeeDestination} style={{float: "right"}} title="Add Fee Destination" />}</H5>
            {verifier.fee_destinations.length == 0 ? 'No Fee Destinations' : verifier.fee_destinations.map(destination => <FeeDestinationDetails key={destination.address} destination={destination} editable={editable} handleChange={handleChange} requestRemoval={() => updateParam('fee_destinations', params.fee_destinations.filter(d => d !== destination))} />)}
        </FeeDestinations>
        {!creating && editable && dirty && <ActionContainer><Button onClick={handleUpdate}>Update</Button></ActionContainer>}
        {creating && <ActionContainer><Button onClick={handleCreate}>Add Verifier</Button></ActionContainer>}
    </AssetVerifierWrapper>
}

interface AssetVerifierDetailProps {
    detail: EntityDetail,
    editable: boolean,
    handleChange: () => any
}

const AssetVerifierDetail: FunctionComponent<AssetVerifierDetailProps> = ({ detail, editable, handleChange }) => {
    const initialState = (entityDetail: EntityDetail) => ({
        name: detail.name,
        description: detail.description,
        home_url: detail.home_url,
        source_url: detail.source_url,
    })

    const [params, setParams] = useState(initialState(detail))

    useEffect(() => {
        setParams(initialState(detail))

    }, [detail])

    const updateParam = (key: string, value: string) => {
        setParams({
            ...params,
            [key]: value
        });
        (detail as any)[key] = value
        handleChange()
    }

    return <>   
        <InputOrDisplay label="Name" value={params.name} editable={editable} onChange={(e) => { updateParam('name', e.target.value) }} />
        <InputOrDisplay label="Description" value={params.description} editable={editable} onChange={(e) => updateParam('description', e.target.value)} />
        <InputOrDisplay label="Home URL" type="url" value={params.home_url} editable={editable} onChange={(e) => { updateParam('home_url', e.target.value) }} />
        <InputOrDisplay label="Source URL" type="url" value={params.source_url} editable={editable} onChange={(e) => { updateParam('source_url', e.target.value) }} />
    </>
}

const FeeDestinations = styled.div`
`

const FeeDestinationWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    grid-gap: 10px;
    > * {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }
`

interface FeeDestinationDetailsProps {
    destination: FeeDestination,
    editable: boolean,
    handleChange: () => any,
    requestRemoval: () => any,
}

const FeeDestinationDetails: FunctionComponent<FeeDestinationDetailsProps> = ({ destination, editable, handleChange, requestRemoval }) => {
    const [params, setParams] = useState({
        address: destination.address,
        fee_percent: destination.fee_percent
    })

    const updateParam = (key: string, value: string) => {
        setParams({
            ...params,
            [key]: value
        });
        (destination as any)[key] = value
        handleChange()
    }

    return <FeeDestinationWrapper>
        <InputOrDisplay label="Address" value={destination.address} editable={editable} onChange={(e) => { updateParam('address', e.target.value) }} />
        <InputOrDisplay label="Fee Percent" value={destination.fee_percent} editable={editable} onChange={(e) => { updateParam('fee_percent', e.target.value) }} />
        {editable && <div><RemoveButton onClick={requestRemoval} /></div>}
    </FeeDestinationWrapper>
}