import { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { FeeDestination } from "../../models";
import { RemoveButton } from "../Button";
import { InputOrDisplay } from "../Input";

const FeeDestinationWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    grid-gap: 10px;
    > * {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }
`

interface FeeDestinationDetailsProps {
    destination: FeeDestination,
    editable: boolean,
    handleChange: () => any,
    requestRemoval: () => any,
}

export const FeeDestinationDetails: FunctionComponent<FeeDestinationDetailsProps> = ({ destination, editable, handleChange, requestRemoval }) => {
    const [params, setParams] = useState({
        address: destination.address,
        fee_percent: destination.fee_percent
    })

    const updateParam = (key: string, value: string) => {
        setParams({
            ...params,
            [key]: value
        });
        (destination as any)[key] = value
        handleChange()
    }

    return <FeeDestinationWrapper>
        <InputOrDisplay label="Address" value={destination.address} editable={editable} onChange={(e) => { updateParam('address', e.target.value) }} />
        <InputOrDisplay label="Fee Percent" value={destination.fee_percent} editable={editable} onChange={(e) => { updateParam('fee_percent', e.target.value) }} />
        {editable && <div><RemoveButton onClick={requestRemoval} /></div>}
    </FeeDestinationWrapper>
}