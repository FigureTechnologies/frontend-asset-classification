import { FunctionComponent } from "react";
import { EntityDetail, newEntityDetail } from "../../models"
import { deepReplace } from "../../utils";
import { InputOrDisplay } from "../Input";

interface EntityDetailProps {
    detail?: EntityDetail,
    editable: boolean,
    detailChanged: (detail: EntityDetail) => any,
}

export const EntityDetailDisplay: FunctionComponent<EntityDetailProps> = ({ detail, editable, detailChanged }) => {
    const handleChange = (key: string, value: string) => {
        detailChanged(deepReplace(detail || newEntityDetail(), key, value))
    };

    return <>
        <InputOrDisplay label="Name" value={detail?.name || ''} editable={editable} onChange={(e) => { handleChange('name', e.target.value) }} />
        <InputOrDisplay label="Description" value={detail?.description || ''} editable={editable} onChange={(e) => { handleChange('description', e.target.value) }} />
        <InputOrDisplay label="Home URL" type="url" value={detail?.home_url || ''} editable={editable} onChange={(e) => { handleChange('home_url', e.target.value) }} />
        <InputOrDisplay label="Source URL" type="url" value={detail?.source_url || ''} editable={editable} onChange={(e) => { handleChange('source_url', e.target.value) }} />
    </>;
}