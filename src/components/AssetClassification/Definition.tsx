import { useWalletConnect, WINDOW_MESSAGES } from "@provenanceio/walletconnect-js"
import deepcopy from "deepcopy"
import { FunctionComponent, useState, useEffect } from "react"
import styled from "styled-components"
import { WHITE, DARK_BG } from "../../constants"
import { QueryAssetDefinitionResponse, VerifierDetail, newVerifier } from "../../models"
import { AssetClassificationContractService } from "../../services"
import { ActionContainer, AddButton, Button, RemoveButton } from "../Button"
import { H4 } from "../Headers"
import { InputOrDisplay } from "../Input"
import { Modal } from "../Modal"
import { AssetVerifier } from "./Verifier"
import deepEqual from "deep-equal";
import { useTransaction } from "../../hooks"

const DefinitionWrapper = styled.div<{ border: boolean }>`
    padding: 20px;
    margin-bottom: 20px;
    background: ${WHITE};
    border-radius: 5px;
    border: ${({ border }) => border && `1px solid ${DARK_BG}`};
    position: relative;
`

const DeleteDefinitionButton = styled(RemoveButton)`
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
`

const DefinitionDetails = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    grid-gap: 10px;
`

const AssetVerifiers = styled.div`
`

interface AssetDefinitionProps {
    definition: QueryAssetDefinitionResponse
    editable: boolean
    creating?: boolean
    service: AssetClassificationContractService,
}

const initialState = (definition: QueryAssetDefinitionResponse) => ({
    asset_type: definition.asset_type,
    scope_spec_address: definition.scope_spec_address,
    verifiers: definition.verifiers,
    enabled: definition.enabled,
})

export const AssetDefinition: FunctionComponent<AssetDefinitionProps> = ({ definition, editable, creating = false, service }) => {
    const { walletConnectService: wcs, walletConnectState } = useWalletConnect()
    const [, setTransaction] = useTransaction()


    const [dirty, setDirty] = useState(false)
    const [isNonVerifierDirty, setIsNonVerifierDirty] = useState(false)
    const [originalDefinition, setOriginalDefinition] = useState(definition)
    const [verifierToAdd, setVerifierToAdd] = useState<VerifierDetail | null>(null)
    const [bindName, setBindName] = useState(true)
    const [verifierToRemove, setVerifierToRemove] = useState<VerifierDetail>()
    const [deletingAssetDefinition, setDeletingAssetDefinition] = useState(false)

    const [params, setParams] = useState(initialState(definition))


    const calculateIsNonVerifierDirty = (curr: QueryAssetDefinitionResponse, original: QueryAssetDefinitionResponse) => {
        return !deepEqual({ ...curr, verifiers: [] }, { ...original, verifiers: [] })
    }

    useEffect(() => {
        console.log('performing deep copy of', definition.asset_type)
        const originalDef = deepcopy(definition)
        setOriginalDefinition(originalDef)
        setParams(initialState(definition))
        setIsNonVerifierDirty(calculateIsNonVerifierDirty(definition, originalDef))
    }, [definition])

    useEffect(() => {
        const callback = () => {
            setVerifierToAdd(null)
        }
        wcs.addListener(WINDOW_MESSAGES.CUSTOM_ACTION_COMPLETE, callback)
        return () => wcs.removeListener(WINDOW_MESSAGES.CUSTOM_ACTION_COMPLETE, callback)
    }, [wcs])

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
        setIsNonVerifierDirty(calculateIsNonVerifierDirty(definition, originalDefinition))
    }

    const handleUpdate = async () => {
        const message = await service.getUpdateAssetDefinitionMessage(definition, walletConnectState.address)
        setTransaction(message)
    }

    const handleCreate = async () => {
        const message = await service.getAddAssetDefinitionMessage(definition, bindName, walletConnectState.address)
        setTransaction(message)
    }

    const handleDelete = async () => {
        const message = await service.getDeleteAssetDefinitionMessage(definition.asset_type, walletConnectState.address)
        setTransaction(message)
    }

    const handleAdd = () => {
        if (creating) {
            updateParam('verifiers', [...params.verifiers, newVerifier()])
        } else {
            setVerifierToAdd(newVerifier())
        }
    }

    const requestVerifierRemoval = (verifier: VerifierDetail) => {
        setVerifierToRemove(verifier)
    }

    const handleRemoveVerifier = async (verifier: VerifierDetail) => {
        const clonedDefinition = deepcopy(definition)
        clonedDefinition.verifiers = clonedDefinition.verifiers.filter(v => v.address !== verifier.address)
        const message = await service.getUpdateAssetDefinitionMessage(clonedDefinition, walletConnectState.address)
        setTransaction(message)
        setVerifierToRemove(undefined)
    }

    return <DefinitionWrapper border={!creating}>
        <DeleteDefinitionButton title="Delete Asset Definition" onClick={() => setDeletingAssetDefinition(true)} />
        <DefinitionDetails>
            <InputOrDisplay label="Asset Type" value={definition.asset_type} editable={creating} onChange={(e) => { updateParam('asset_type', e.target.value) }} />
            <InputOrDisplay label="Scope Spec Address" editable={editable} value={definition.scope_spec_address} onChange={(e) => { updateParam('scope_spec_address', e.target.value) }} />
            <InputOrDisplay label="Enabled" editable={editable} checked={params.enabled} value={`${definition.enabled}`} type="checkbox" onChange={(e) => { updateParam('enabled', e.target.checked) }} />
            {creating && <InputOrDisplay label="Bind Name" editable checked={bindName} type="checkbox" onChange={(e) => { setBindName(e.target.checked) }} />}
        </DefinitionDetails>
        <AssetVerifiers>
            <H4>Asset Verifiers {editable && <AddButton onClick={handleAdd} style={{float: 'right'}} title={`Add Asset Verifier for ${params.asset_type}`}/>}</H4>
            {definition.verifiers.length === 0 ? 'No Asset Verifiers' : definition.verifiers.map(verifier => <AssetVerifier key={verifier.address}
                asset_type={definition.asset_type}
                verifier={verifier}
                editable={editable}
                service={service}
                newDefinition={creating}
                definitionDirty={isNonVerifierDirty}
                onChange={(verifier) => updateParam('verifiers', definition.verifiers.map(v => v.address === verifier.address ? verifier : v))}
                requestRemoval={() => requestVerifierRemoval(verifier)}
            />)}
        </AssetVerifiers>
        {!creating && editable && dirty && isNonVerifierDirty && <ActionContainer><Button onClick={handleUpdate}>Update Definition</Button></ActionContainer>}
        {verifierToAdd && <Modal requestClose={() => setVerifierToAdd(null)}><AssetVerifier asset_type={definition.asset_type} verifier={verifierToAdd} editable creating service={service} /> </Modal>}
        {creating && <ActionContainer><Button onClick={handleCreate}>Add Definition</Button></ActionContainer>}
        {verifierToRemove && <Modal requestClose={() => setVerifierToRemove(undefined)}>
            {`Are you sure you want to remove verifier for ${definition.asset_type} with address ${verifierToRemove.address}?`}
            <ActionContainer>
                <Button secondary onClick={() => setVerifierToRemove(undefined)}>Cancel</Button>
                <Button onClick={() => handleRemoveVerifier(verifierToRemove)}>Yes, Remove Verifier</Button>
            </ActionContainer>
        </Modal>}
        {deletingAssetDefinition && <Modal requestClose={() => setDeletingAssetDefinition(false)}>
            {`Are you sure you want to delete the asset definition for asset type ${definition.asset_type}?`}
            <ActionContainer>
                <Button secondary onClick={() => setDeletingAssetDefinition(false)}>Cancel</Button>
                <Button onClick={handleDelete}>Yes, Delete Assset Definition</Button>
            </ActionContainer>
        </Modal>}
    </DefinitionWrapper>
}