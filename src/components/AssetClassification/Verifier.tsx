import { useWalletConnect } from "@provenanceio/walletconnect-js"
import deepcopy from "deepcopy"
import { FunctionComponent, useState, useEffect } from "react"
import styled from "styled-components"
import { DARK_TEXT } from "../../constants"
import { VerifierDetail, newEntityDetail, OnboardingCost, newOnboardingCost, newFeeDestination } from "../../models"
import { AssetClassificationContractService } from "../../services"
import { ActionContainer, AddButton, Button, IconButtonBody, RemoveButton } from "../Button"
import { H5, H6 } from "../Headers"
import { InputOrDisplay, InputOrDisplayWrapper } from "../Input"
import { FeeDestinationDetails } from "./FeeDestination"
import deepEqual from "deep-equal";
import { EntityDetailDisplay } from "./EntityDetailDisplay"
import { arrayOrUndefined, deepReplace } from "../../utils"
import { useSendACContractMessage } from "../../hooks/useWrapSendMessage"

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

export const AssetVerifier: FunctionComponent<AssetVerifierProps> = ({ asset_type, verifier, editable, creating = false, newDefinition, definitionDirty, service, onChange = (v) => {}, requestRemoval = () => {} }) => {
    // todo: edit handler at this level for individual asset verifier update

    const { walletConnectState } = useWalletConnect()
    const { mutateAsync: sendMessage } = useSendACContractMessage()

    const [updatedVerifier, setUpdatedVerifier] = useState(verifier)
    const [dirty, setDirty] = useState(false)
    const [onboardingCost, setOnboardingCost] = useState(getOnboardingCost(verifier))

    const handleChange = (newVerifier: VerifierDetail) => {
        setUpdatedVerifier(newVerifier)
        setDirty(!deepEqual(verifier, newVerifier, { strict: true }))
        onChange(newVerifier)
    }

    const updateVerifierField = (key: string, value: any) => {
        handleChange(deepReplace(updatedVerifier, key, value))
    }

    useEffect(() => {
        if (!verifier.entity_detail) {
            verifier.entity_detail = newEntityDetail()
        }
        setUpdatedVerifier(deepcopy(verifier))
        setOnboardingCost(getOnboardingCost(verifier))
    }, [verifier])

    const handleCostChange = (cost: string) => {
        const match = /(?<cost>[0-9]*)(?<denom>[a-zA-Z]*)/.exec(cost)
        const newVerifier: VerifierDetail = {
            ...updatedVerifier,
            onboarding_cost: (match?.groups && match.groups['cost']) || '0',
            onboarding_denom: (match?.groups && match.groups['denom']) || ''
        }
        handleChange(newVerifier)
        setOnboardingCost(getOnboardingCost(newVerifier))
    }

    const handleUpdate = async() => {
        const message = await service.getUpdateAssetVerifierMessage(asset_type, updatedVerifier, walletConnectState.address)
        await sendMessage({ tx: message })
    }

    const handleCreate = async() => {
        const message = await service.getAddAssetVerifierMessage(asset_type, updatedVerifier, walletConnectState.address)
        await sendMessage({ tx: message })
    }

    const addFeeDestination = () => {
        updateVerifierField('fee_destinations', [...updatedVerifier.fee_destinations, newFeeDestination()])
    }

    return <AssetVerifierWrapper>
        {!creating && editable && <DeleteVerifierButton onClick={requestRemoval} title="Remove Asset Verifier" />}
        <AssetVerifierDetails>
            <InputOrDisplay label="Verifier Address" value={updatedVerifier.address} editable={editable} onChange={(e) => { updateVerifierField('address', e.target.value) }} />
            <InputOrDisplay label="Onboarding Cost" value={onboardingCost} editable={editable} onChange={(e) => handleCostChange(e.target.value)} />
            <EntityDetailDisplay detail={updatedVerifier.entity_detail} editable={editable} detailChanged={(detail) => updateVerifierField('entity_detail', detail)} />
        </AssetVerifierDetails>
        <FeeDestinations>
            <HeaderContainer>
                <H5>Fee Destinations</H5>
                {editable && <AddButton onClick={addFeeDestination} title="Add Fee Destination" />}
            </HeaderContainer>
            {updatedVerifier.fee_destinations.length === 0 ? 'No Fee Destinations' : updatedVerifier.fee_destinations.map((destination, i) => <FeeDestinationDetails key={destination.address} destination={destination} editable={editable} destinationChanged={destination => updateVerifierField(`fee_destinations.${i}`, destination)} requestRemoval={() => updateVerifierField('fee_destinations', updatedVerifier.fee_destinations.filter((_, j) => i !== j))} />)}
        </FeeDestinations>
        <FeeDestinations>
            <OnboardingCostManager
                onboardingCost={updatedVerifier.retry_cost}
                editable={editable}
                title="Retry Cost"
                updateOnboardingCost={cost => updateVerifierField('retry_cost', cost)} />
        </FeeDestinations>
        <FeeDestinations>
            <OnboardingCostManager
                onboardingCost={updatedVerifier.subsequent_classification_detail?.cost}
                editable={editable}
                title="Subsequent Classification Detail Cost"
                updateOnboardingCost={cost => updateVerifierField('subsequent_classification_detail.cost', cost)}
            >
                <HeaderContainer>
                    <H6>Applicable Asset Types</H6>
                    {editable && <AddButton title="Add Applicable Asset Type" onClick={() => updateVerifierField('subsequent_classification_detail.applicable_asset_types', [...(updatedVerifier.subsequent_classification_detail?.applicable_asset_types || []), ''])} />}
                </HeaderContainer>
                {updatedVerifier.subsequent_classification_detail?.applicable_asset_types?.map((assetType, i) => <HeaderContainer key={`applicable-asset-type-${i}`}>
                    <InputOrDisplay
                        label=""
                        style={{marginTop: '10px'}}
                        value={assetType}
                        editable={editable}
                        onChange={(e) => { updateVerifierField(`subsequent_classification_detail.applicable_asset_types.${i}`, e.target.value)}} 
                    />
                    {editable && <RemoveButton onClick={() => updateVerifierField('subsequent_classification_detail.applicable_asset_types', arrayOrUndefined(updatedVerifier.subsequent_classification_detail?.applicable_asset_types?.filter((_, j) => i !== j)))} style={{ alignSelf: 'flex-end' }} title={`Remove Applicable Asset Type`} />}
                </HeaderContainer>)}
                
            </OnboardingCostManager>
        </FeeDestinations>
        {!newDefinition && !creating && editable && dirty && !definitionDirty && <ActionContainer><Button onClick={handleUpdate}>Update Verifier</Button></ActionContainer>}
        {!newDefinition && creating && <ActionContainer><Button onClick={handleCreate}>Add Verifier</Button></ActionContainer>}
    </AssetVerifierWrapper>
}

interface OnboardingCostManagerProps {
    onboardingCost?: OnboardingCost,
    updateOnboardingCost: (onboardingCost: OnboardingCost | undefined) => any,
    editable: boolean,
    title: string,
}

const OnboardingCostManager: FunctionComponent<OnboardingCostManagerProps> = ({ onboardingCost, updateOnboardingCost, editable, title, children }) => {
    const updateCost = (path: string, value: any) => {
        updateOnboardingCost(deepReplace(onboardingCost, path, value))
    }

    return <FeeDestinations>
        <HeaderContainer>
            <H5>{title}</H5>
            {editable && !onboardingCost && <AddButton onClick={() => updateOnboardingCost(newOnboardingCost())} title={`Add ${title}`}/>}
            {editable && onboardingCost && <RemoveButton onClick={() => updateOnboardingCost(undefined)} title={`Remove ${title}`}/>}
        </HeaderContainer>
        {onboardingCost && <>
            <HeaderContainer>
                <InputOrDisplay label="Cost" value={onboardingCost?.cost || ''} editable={editable} onChange={(e) => { updateCost('cost', e.target.value) }} />
                {editable && <AddButton onClick={() => updateCost('fee_destinations', [...onboardingCost.fee_destinations, newFeeDestination()])} style={{ alignSelf: 'flex-end' }} title={`Add ${title} Fee Destination`} />}
            </HeaderContainer>
            {children}
            <H5>Fee Destinations</H5>
            {!onboardingCost?.fee_destinations?.length ? 'No Fee Destinations' : onboardingCost.fee_destinations.map((destination, i) => <FeeDestinationDetails key={destination.address} destination={destination} editable={editable} destinationChanged={(d) => updateCost(`fee_destinations.${i}`, d)} requestRemoval={() => updateCost('fee_destinations', onboardingCost.fee_destinations.filter((_, j) => i !== j))} />)}
        </>}
    </FeeDestinations>
}

const FeeDestinations = styled.div`
`

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    > ${InputOrDisplayWrapper} {
        flex-grow: 1;
    }

    > ${IconButtonBody} {
        margin-left: 10px;
    }
`