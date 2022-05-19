import styled from "styled-components";

export const TwoColumnGrid = styled.div<{ actionColumn: boolean }>`
    display: grid;
    grid-template-columns: 1fr 1fr ${({ actionColumn }) => actionColumn && 'auto'};
`

export const TwoColumnFlex = styled.div`
    display: flex;
    justify-content: space-between;
`