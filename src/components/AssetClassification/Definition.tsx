import { useWalletConnect } from "@provenanceio/walletconnect-js"
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
import { deepReplace } from "../../utils"
import { useSendACContractMessage, TransactionMeta } from "../../hooks/useWrapSendMessage"

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

export const AssetDefinition: FunctionComponent<AssetDefinitionProps> = ({ definition, editable, creating = false, service }) => {
    const { walletConnectState } = useWalletConnect()
    const { mutateAsync: sendMessage } = useSendACContractMessage()

    const [dirty, setDirty] = useState(false)
    const [isNonVerifierDirty, setIsNonVerifierDirty] = useState(false)
    const [updatedDefinition, setUpdatedDefinition] = useState(definition)
    const [verifierToAdd, setVerifierToAdd] = useState<VerifierDetail | null>(null)
    const [bindName, setBindName] = useState(true)
    const [verifierToRemove, setVerifierToRemove] = useState<VerifierDetail>()
    const [deletingAssetDefinition, setDeletingAssetDefinition] = useState(false)

    const calculateIsNonVerifierDirty = (curr: QueryAssetDefinitionResponse, original: QueryAssetDefinitionResponse) => {
        return !deepEqual({ ...curr, verifiers: [] }, { ...original, verifiers: [] })
    }

    useEffect(() => {
        const originalDef = deepcopy(definition)
        setUpdatedDefinition(originalDef)
        setIsNonVerifierDirty(calculateIsNonVerifierDirty(definition, originalDef))
    }, [definition])

    const updateDefinitionField = (key: string, value: any) => {
        const newDefinition = deepReplace(updatedDefinition, key, value)
        setUpdatedDefinition(newDefinition)
        setIsNonVerifierDirty(calculateIsNonVerifierDirty(definition, newDefinition))
        setDirty(!deepEqual(definition, updatedDefinition, { strict: true }))
    }

    const sendMessageAndClearVerifier = async (tx: TransactionMeta) => {
        await sendMessage({ tx }, {
            onSuccess: () => setVerifierToAdd(null)
        })
    }

    const handleUpdate = async () => {
        const message = await service.getUpdateAssetDefinitionMessage(definition, walletConnectState.address)
        await sendMessageAndClearVerifier(message)
    }

    const handleCreate = async () => {
        const message = await service.getAddAssetDefinitionMessage(definition, bindName, walletConnectState.address)
        await sendMessageAndClearVerifier(message)
    }

    const handleDelete = async () => {
        const message = await service.getDeleteAssetDefinitionMessage(definition.asset_type, walletConnectState.address)
        await sendMessageAndClearVerifier(message)
    }

    const handleAdd = () => {
        if (creating) {
            updateDefinitionField('verifiers', [...updatedDefinition.verifiers, newVerifier()])
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
        await sendMessageAndClearVerifier(message)
        setVerifierToRemove(undefined)
        setUpdatedDefinition(clonedDefinition)
    }

    return <DefinitionWrapper border={!creating}>
        {editable && !creating && <DeleteDefinitionButton title="Delete Asset Definition" onClick={() => setDeletingAssetDefinition(true)} />}
        <DefinitionDetails>
            <InputOrDisplay label="Asset Type" value={updatedDefinition.asset_type} editable={creating} onChange={(e) => { updateDefinitionField('asset_type', e.target.value) }} />
            <InputOrDisplay label="Display Name" value={updatedDefinition.display_name} editable={editable} onChange={(e) => { updateDefinitionField('display_name', e.target.value) }} />
            <InputOrDisplay label="Enabled" editable={editable} checked={updatedDefinition.enabled} value={`${definition.enabled}`} type="checkbox" onChange={(e) => { updateDefinitionField('enabled', e.target.checked) }} />
            {creating && <InputOrDisplay label="Bind Name" editable checked={bindName} type="checkbox" onChange={(e) => { setBindName(e.target.checked) }} />}
        </DefinitionDetails>
        <AssetVerifiers>
            <H4>Asset Verifiers {editable && <AddButton onClick={handleAdd} style={{float: 'right'}} title={`Add Asset Verifier for ${updatedDefinition.asset_type}`}/>}</H4>
            {updatedDefinition.verifiers.length === 0 ? 'No Asset Verifiers' : updatedDefinition.verifiers.map(verifier => <AssetVerifier key={verifier.address}
                asset_type={updatedDefinition.asset_type}
                verifier={verifier}
                editable={editable}
                service={service}
                newDefinition={creating}
                definitionDirty={isNonVerifierDirty}
                onChange={(verifier) => updateDefinitionField('verifiers', updatedDefinition.verifiers.map(v => v.address === verifier.address ? verifier : v))}
                requestRemoval={() => requestVerifierRemoval(verifier)}
            />)}
        </AssetVerifiers>
        {!creating && editable && dirty && isNonVerifierDirty && <ActionContainer><Button onClick={handleUpdate}>Update Definition</Button></ActionContainer>}
        {verifierToAdd && <Modal requestClose={() => setVerifierToAdd(null)}><AssetVerifier asset_type={updatedDefinition.asset_type} verifier={verifierToAdd} editable creating service={service} /> </Modal>}
        {creating && <ActionContainer><Button onClick={handleCreate}>Add Definition</Button></ActionContainer>}
        {verifierToRemove && <Modal requestClose={() => setVerifierToRemove(undefined)}>
            {`Are you sure you want to remove verifier for ${updatedDefinition.asset_type} with address ${verifierToRemove.address}?`}
            <ActionContainer>
                <Button secondary onClick={() => setVerifierToRemove(undefined)}>Cancel</Button>
                <Button onClick={() => handleRemoveVerifier(verifierToRemove)}>Yes, Remove Verifier</Button>
            </ActionContainer>
        </Modal>}
        {editable && !creating && deletingAssetDefinition && <Modal requestClose={() => setDeletingAssetDefinition(false)}>
            {`Are you sure you want to delete the asset definition for asset type ${updatedDefinition.asset_type}?`}
            <ActionContainer>
                <Button secondary onClick={() => setDeletingAssetDefinition(false)}>Cancel</Button>
                <Button onClick={handleDelete}>Yes, Delete Assset Definition</Button>
            </ActionContainer>
        </Modal>}
    </DefinitionWrapper>
}