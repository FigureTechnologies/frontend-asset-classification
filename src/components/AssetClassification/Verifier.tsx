import { useWalletConnect } from "@provenanceio/walletconnect-js"
import deepcopy from "deepcopy"
import { FunctionComponent, useState, useEffect } from "react"
import styled from "styled-components"
import { DARK_TEXT } from "../../constants"
import { VerifierDetail, newEntityDetail, EntityDetail, FeeDestination } from "../../models"
import { AssetClassificationContractService } from "../../services"
import { ActionContainer, AddButton, Button, RemoveButton } from "../Button"
import { H5 } from "../Headers"
import { InputOrDisplay } from "../Input"
import { FeeDestinationDetails } from "./FeeDestination"
import deepEqual from "deep-equal";
import { useTransaction } from "../../hooks"
import { EntityDetailDisplay } from "./EntityDetailDisplay"

const AssetVerifierWrapper = styled.div`
    position: relative;
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

const DeleteVerifierButton = styled(RemoveButton)`
    position: absolute;
    top: 0;
    left: -2px;
    font-size: 1rem;
    transform: translate(-50%, -50%);
`

interface AssetVerifierProps {
    asset_type: string,
    verifier: VerifierDetail,
    editable: boolean,
    creating?: boolean,
    service: AssetClassificationContractService,
    newDefinition?: boolean,
    definitionDirty?: boolean,
    requestRemoval?: () => any,
    onChange?: (verifier: VerifierDetail) => any,
}

const getOnboardingCost = (verifier: VerifierDetail): string => `${verifier.onboarding_cost}${verifier.onboarding_denom}`

const intitialState = (verifier: VerifierDetail) => ({
    address: verifier.address,
    onboardingCost: getOnboardingCost(verifier),
    fee_destinations: verifier.fee_destinations
})


export const AssetVerifier: FunctionComponent<AssetVerifierProps> = ({ asset_type, verifier, editable, creating = false, newDefinition, definitionDirty, service, onChange = (v) => {}, requestRemoval = () => {} }) => {
    // todo: edit handler at this level for individual asset verifier update

    const { walletConnectState } = useWalletConnect()
    const [, setTransaction] = useTransaction()

    const [originalVerifier, setOriginalVerifier] = useState(verifier)
    const [dirty, setDirty] = useState(false)
    const [onboardingCost, setOnboardingCost] = useState(getOnboardingCost(verifier))

    const [params, setParams] = useState(intitialState(verifier))

    const handleChange = () => {
        setDirty(!deepEqual(verifier, originalVerifier, { strict: true }))
        onChange(verifier)
    }

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
        setOnboardingCost(getOnboardingCost(verifier))
        if (!verifier.entity_detail) {
            verifier.entity_detail = newEntityDetail()
        }
    }, [verifier])

    const handleCostChange = (cost: string) => {
        const match = /(?<cost>[0-9]*)(?<denom>[a-zA-Z]*)/.exec(cost)
        verifier.onboarding_cost = (match?.groups && match.groups['cost']) || '0'
        verifier.onboarding_denom = (match?.groups && match.groups['denom']) || ''
        setOnboardingCost(getOnboardingCost(verifier))
        handleChange()
    }

    const handleUpdate = async() => {
        const message = await service.getUpdateAssetVerifierMessage(asset_type, verifier, walletConnectState.address)
        setTransaction(message)
    }

    const handleCreate = async() => {
        const message = await service.getAddAssetVerifierMessage(asset_type, verifier, walletConnectState.address)
        setTransaction(message)
    }

    const addFeeDestination = () => {
        const newFeeDestination: FeeDestination = {
            address: '',
            fee_amount: '',
        }
        updateParam('fee_destinations', [...params.fee_destinations, newFeeDestination])
    }

    return <AssetVerifierWrapper>
        {!creating && editable && <DeleteVerifierButton onClick={requestRemoval} title="Remove Asset Verifier" />}
        <AssetVerifierDetails>
            <InputOrDisplay label="Verifier Address" value={params.address} editable={editable} onChange={(e) => { updateParam('address', e.target.value) }} />
            <InputOrDisplay label="Onboarding Cost" value={onboardingCost} editable={editable} onChange={(e) => handleCostChange(e.target.value)} />
            <EntityDetailDisplay detail={verifier.entity_detail as EntityDetail} editable={editable} handleChange={handleChange} />
        </AssetVerifierDetails>
        <FeeDestinations>
            <H5>Fee Destinations {editable && <AddButton onClick={addFeeDestination} style={{float: "right"}} title="Add Fee Destination" />}</H5>
            {verifier.fee_destinations.length === 0 ? 'No Fee Destinations' : verifier.fee_destinations.map(destination => <FeeDestinationDetails key={destination.address} destination={destination} editable={editable} handleChange={handleChange} requestRemoval={() => updateParam('fee_destinations', params.fee_destinations.filter(d => d !== destination))} />)}
        </FeeDestinations>
        {!newDefinition && !creating && editable && dirty && !definitionDirty && <ActionContainer><Button onClick={handleUpdate}>Update Verifier</Button></ActionContainer>}
        {!newDefinition && creating && <ActionContainer><Button onClick={handleCreate}>Add Verifier</Button></ActionContainer>}
    </AssetVerifierWrapper>
}

const FeeDestinations = styled.div`
`