import { FunctionComponent, useEffect, useState } from "react";
import styled from "styled-components";
import { EntityDetail, FeeDestination, newEntityDetail } from "../../models";
import { RemoveButton } from "../Button";
import { InputOrDisplay } from "../Input";
import { EntityDetailDisplay } from "./EntityDetailDisplay";

const FeeDestinationControlWrapper = styled.div`
    display: flex;
    gap: 10px;
    padding-bottom: 25px;
`;

const FeeDestinationContentWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    width: 100%;
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
    useEffect(() => {
        if (!destination.entity_detail) {
            destination.entity_detail = newEntityDetail();
        }
    }, [destination])

    const [params, setParams] = useState({
        address: destination.address,
        fee_amount: destination.fee_amount,
        entity_detail: destination.entity_detail,
    })

    const updateParam = (key: string, value: any) => {
        setParams({
            ...params,
            [key]: value
        });
        (destination as any)[key] = value
        handleChange()
    }

    return <FeeDestinationControlWrapper>
        {editable && <div><RemoveButton onClick={requestRemoval} /></div>}
        <FeeDestinationContentWrapper>
            <InputOrDisplay label="Address" value={destination.address} editable={editable} onChange={(e) => { updateParam('address', e.target.value) }} />
            <InputOrDisplay label="Fee Amount" value={destination.fee_amount} editable={editable} onChange={(e) => { updateParam('fee_amount', e.target.value) }} />
            <EntityDetailDisplay detail={destination.entity_detail as EntityDetail} editable={editable} handleChange={handleChange} />
        </FeeDestinationContentWrapper>
    </FeeDestinationControlWrapper>;
}