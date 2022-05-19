import { useWalletConnect } from "@provenanceio/walletconnect-js"
import deepcopy from "deepcopy"
import { FunctionComponent, useState, useEffect } from "react"
import styled from "styled-components"
import { DARK_TEXT } from "../../constants"
import { VerifierDetail, newEntityDetail, EntityDetail } from "../../models"
import { AssetClassificationContractService } from "../../services"
import { ActionContainer, AddButton, Button } from "../Button"
import { H5 } from "../Headers"
import { InputOrDisplay } from "../Input"
import { FeeDestinationDetails } from "./FeeDestination"
import deepEqual from "deep-equal";

const AssetVerifierWrapper = styled.div`
    margin-top: 20px;
    padding-left: 20px;
    border-left: 5px solid ${DARK_TEXT};
    &:not(:last-of-type) {
        padding-bottom: 10px;
        /* border-bottom: 1px solid ${DARK_TEXT}; */
    }
`

const AssetVerifierDetails = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
`
interface AssetVerifierProps {
    asset_type: string,
    verifier: VerifierDetail,
    editable: boolean,
    creating?: boolean,
    handleTransaction: (message: string) => any,
    service: AssetClassificationContractService
}

const intitialState = (verifier: VerifierDetail) => ({
    address: verifier.address,
    onboardingCost: `${verifier.onboarding_cost}${verifier.onboarding_denom}`,
    fee_percent: verifier.fee_percent,
    fee_destinations: verifier.fee_destinations
})

export const AssetVerifier: FunctionComponent<AssetVerifierProps> = ({ asset_type, verifier, editable, creating = false, handleTransaction, service }) => {
    // todo: edit handler at this level for individual asset verifier update

    const { walletConnectState } = useWalletConnect()

    const [originalVerifier, setOriginalVerifier] = useState(verifier)
    const [dirty, setDirty] = useState(false)
    const [onboardingCost, setOnboardingCost] = useState(`${verifier.onboarding_cost}${verifier.onboarding_denom}`)

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
        const message = await service.getUpdateAssetVerifierMessage(asset_type, verifier, walletConnectState.address)
        handleTransaction(message)
    }

    const handleCreate = async() => {
        const message = await service.getAddAssetVerifierMessage(asset_type, verifier, walletConnectState.address)
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
            <AssetVerifierDetail detail={verifier.entity_detail as EntityDetail} editable={editable} handleChange={handleChange} />
            <InputOrDisplay label="Fee Percent" type="number" min="0" value={params.fee_percent} editable={editable} onChange={(e) => { updateParam('fee_percent', e.target.value) }} />
        </AssetVerifierDetails>
        <FeeDestinations>
            <H5>Fee Destinations {editable && <AddButton onClick={addFeeDestination} style={{float: "right"}} title="Add Fee Destination" />}</H5>
            {verifier.fee_destinations.length === 0 ? 'No Fee Destinations' : verifier.fee_destinations.map(destination => <FeeDestinationDetails key={destination.address} destination={destination} editable={editable} handleChange={handleChange} requestRemoval={() => updateParam('fee_destinations', params.fee_destinations.filter(d => d !== destination))} />)}
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

const initialState = (entityDetail: EntityDetail) => ({
    name: entityDetail.name,
    description: entityDetail.description,
    home_url: entityDetail.home_url,
    source_url: entityDetail.source_url,
})

const AssetVerifierDetail: FunctionComponent<AssetVerifierDetailProps> = ({ detail, editable, handleChange }) => {

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