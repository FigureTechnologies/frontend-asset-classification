import deepcopy from "deepcopy";
import { FunctionComponent, useEffect, useState } from "react";
import styled from "styled-components";
import { FeeDestination, newEntityDetail } from "../../models";
import { deepReplace } from "../../utils";
import { RemoveButton } from "../Button";
import { InputOrDisplay } from "../Input";
import { EntityDetailDisplay } from "./EntityDetailDisplay";

const FeeDestinationControlWrapper = styled.div`
    display: flex;
    gap: 10px;
    &:not(:last-child) {
        padding-bottom: 25px;
    }
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
    destinationChanged: (destination: FeeDestination) => any,
    requestRemoval: () => any,
}

export const FeeDestinationDetails: FunctionComponent<FeeDestinationDetailsProps> = ({ destination, editable, destinationChanged, requestRemoval }) => {
    const [updatedDestination, setUpdatedDestination] = useState(destination);

    useEffect(() => {
        if (!destination.entity_detail) {
            destination.entity_detail = newEntityDetail();
        }
        setUpdatedDestination(deepcopy(destination))
    }, [destination])

    const updateDestination = (key: string, value: any) => {
        destinationChanged(deepReplace(updatedDestination, key, value))
    }

    return <FeeDestinationControlWrapper>
        {editable && <div><RemoveButton onClick={requestRemoval} /></div>}
        <FeeDestinationContentWrapper>
            <InputOrDisplay label="Address" value={updatedDestination.address} editable={editable} onChange={(e) => { updateDestination('address', e.target.value) }} />
            <InputOrDisplay label="Fee Amount" value={updatedDestination.fee_amount} editable={editable} onChange={(e) => { updateDestination('fee_amount', e.target.value) }} />
            <EntityDetailDisplay detail={updatedDestination.entity_detail} editable={editable} detailChanged={detail => updateDestination('entity_detail', detail)} />
        </FeeDestinationContentWrapper>
    </FeeDestinationControlWrapper>;
}