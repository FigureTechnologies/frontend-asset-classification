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
        fee_amount: destination.fee_amount
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
        <InputOrDisplay label="Fee Amount" value={destination.fee_amount} editable={editable} onChange={(e) => { updateParam('fee_amount', e.target.value) }} />
        {editable && <div><RemoveButton onClick={requestRemoval} /></div>}
    </FeeDestinationWrapper>
}