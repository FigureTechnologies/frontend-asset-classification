import styled from "styled-components";

export const ActionContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    > *:not(:last-child) {
        margin-right: 10px;
    }
`