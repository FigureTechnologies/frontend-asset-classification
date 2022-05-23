import { FunctionComponent, useEffect, useState } from "react";
import { useAssetClassificationService, useAssetDefinitions, useInvalidateAssetDefinitions, useIsAdmin, useTransaction } from "../../hooks";
import { newDefinition, QueryAssetDefinitionResponse } from "../../models";
import { H3 } from "../Headers";
import { AddButton } from "../Button";
import { Modal } from "../Modal";
import { TwoColumnFlex } from "../Layout";
import { AssetDefinition } from "../AssetClassification";

interface AssetTypeConfigProps {
}

export const AssetTypeConfig: FunctionComponent<AssetTypeConfigProps> = () => {
    const { data: assetDefinitions, isLoading, isError } = useAssetDefinitions()
    const invalidateAssetDefinitions = useInvalidateAssetDefinitions()
    const isAdmin = useIsAdmin()
    const editable = isAdmin
    const [transaction] = useTransaction()

    const [addingDefinition, setAddingDefinition] = useState<QueryAssetDefinitionResponse | null>(null)
    const service = useAssetClassificationService()

    useEffect(() => {
        if (!transaction) {
            invalidateAssetDefinitions()
        }
    }, [transaction, invalidateAssetDefinitions])

    const handleAdd = () => {
        setAddingDefinition(newDefinition())
    }

    if (isLoading) {
        <div>Loading</div>
    }

    if (isError) {
        return <></>
    }

    return <div>
        <H3><TwoColumnFlex>Asset Definitions {editable && <AddButton onClick={handleAdd} title="Add Asset Definition" />}</TwoColumnFlex></H3>
        {assetDefinitions?.map(definition => <AssetDefinition key={definition.asset_type} definition={definition} editable={editable} service={service} />)}
        {addingDefinition && <Modal requestClose={() => setAddingDefinition(null)}><AssetDefinition definition={addingDefinition} editable creating service={service} /></Modal>}
    </div>
}

