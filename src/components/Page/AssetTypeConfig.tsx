import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { useAssetClassificationService, useAssetDefinitions, useInvalidateAssetDefinitions, useIsAdmin } from "../../hooks";
import { EntityDetail, FeeDestination, newDefinition, newEntityDetail, newVerifier, QueryAssetDefinitionResponse, VerifierDetail } from "../../models";
import { H3, H4, H5 } from "../Headers";
import styled from 'styled-components'
import { ASSET_CONTRACT_ALIAS_NAME, DARK_BG, DARK_TEXT, LIGHT_TEXT, MSG_EXECUTE_CONTRACT_TYPE, PRIMARY_ACCENT, ROOT_ASSET_CLASSIFICATION_NAME, WHITE } from "../../constants";
import { Input, InputOrDisplay, InputOrDisplayWrapper } from "../Input";
import deepEqual from "deep-equal";
import deepcopy from 'deepcopy'
import { AddButton, Button } from "../Button";
import { AssetClassificationContractService } from "../../services";
import { useWalletConnect, WINDOW_MESSAGES } from "@provenanceio/walletconnect-js";
import { Any } from "google-protobuf/google/protobuf/any_pb";
import { Modal } from "../Modal";
import { TwoColumnFlex } from "../Layout";
import { AssetDefinition } from "../AssetClassification";

interface AssetTypeConfigProps {
}

export const AssetTypeConfig: FunctionComponent<AssetTypeConfigProps> = () => {
    const { data: assetDefinitions, isLoading, ...rest } = useAssetDefinitions()
    const invalidateAssetDefinitions = useInvalidateAssetDefinitions()
    const isAdmin = useIsAdmin()
    const editable = isAdmin

    const { walletConnectService: wcs, walletConnectState } = useWalletConnect()

    const [addingDefinition, setAddingDefinition] = useState<QueryAssetDefinitionResponse | null>(null)
    const service = useAssetClassificationService()

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
        {assetDefinitions?.map(definition => <AssetDefinition key={definition.asset_type} definition={definition} editable={editable} handleTransaction={handleTransaction} service={service} />)}
        {addingDefinition && <Modal requestClose={() => setAddingDefinition(null)}><AssetDefinition definition={addingDefinition} editable creating handleTransaction={handleTransaction} service={service} /></Modal>}
    </div>
}

