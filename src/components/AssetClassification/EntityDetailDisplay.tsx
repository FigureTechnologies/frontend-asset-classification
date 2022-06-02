import { FunctionComponent, useEffect, useState } from "react";
import { EntityDetail } from "../../models"
import { InputOrDisplay } from "../Input";

interface EntityDetailProps {
    detail: EntityDetail,
    editable: boolean,
    handleChange: () => any,
}

const initialState = (entityDetail?: EntityDetail) => ({
    name: entityDetail?.name || '',
    description: entityDetail?.description || '',
    home_url: entityDetail?.home_url || '',
    source_url: entityDetail?.source_url || '',
})

export const EntityDetailDisplay: FunctionComponent<EntityDetailProps> = ({ detail, editable, handleChange }) => {
    const [params, setParams] = useState(initialState(detail));

    useEffect(() => setParams(initialState(detail)), [detail]);

    const updateParam = (key: string, value: string) => {
        setParams({
            ...params,
            [key]: value,
        });
        (detail as any)[key] = value;
        handleChange();
    };

    return <>
        <InputOrDisplay label="Name" value={params.name} editable={editable} onChange={(e) => { updateParam('name', e.target.value) }} />
        <InputOrDisplay label="Description" value={params.description} editable={editable} onChange={(e) => { updateParam('description', e.target.value) }} />
        <InputOrDisplay label="Home URL" type="url" value={params.home_url} editable={editable} onChange={(e) => { updateParam('home_url', e.target.value) }} />
        <InputOrDisplay label="Source URL" type="url" value={params.source_url} editable={editable} onChange={(e) => { updateParam('source_url', e.target.value) }} />
    </>;
}