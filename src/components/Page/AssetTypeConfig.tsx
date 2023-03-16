import { FunctionComponent, useState } from "react";
import { useAssetClassificationService, useAssetDefinitions, useIsAdmin } from "../../hooks";
import { newDefinition, QueryAssetDefinitionResponse } from "../../models";
import { H3, H4 } from "../Headers";
import { AddButton } from "../Button";
import { Modal } from "../Modal";
import { TwoColumnFlex } from "../Layout";
import { AssetDefinition } from "../AssetClassification";

interface AssetTypeConfigProps {
}

export const AssetTypeConfig: FunctionComponent<AssetTypeConfigProps> = () => {
    const { data: assetDefinitions, isLoading, isError } = useAssetDefinitions()
    const isAdmin = useIsAdmin()
    const editable = isAdmin

    const [addingDefinition, setAddingDefinition] = useState<QueryAssetDefinitionResponse | null>(null)
    const service = useAssetClassificationService()

    // useEffect(() => {
    //     const callback = () => {
    //         setAddingDefinition(null)
    //     }
    //     wcs.addListener(WINDOW_MESSAGES.CUSTOM_ACTION_COMPLETE, callback)
    //     return () => wcs.removeListener(WINDOW_MESSAGES.CUSTOM_ACTION_COMPLETE, callback)
    // }, [wcs])

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
        {!assetDefinitions?.length && <H4>No Asset Definitions</H4>}
        {addingDefinition && <Modal requestClose={() => setAddingDefinition(null)}><AssetDefinition definition={addingDefinition} editable creating service={service} /></Modal>}
    </div>
}

