import { FunctionComponent } from "react";
import styled, { keyframes } from 'styled-components'
import { DARK_BG, PRIMARY_ACCENT, PRIMARY_ACCENT_LIGHT, WHACKY_ACCENT, WHACKY_ACCENT_2, WHITE } from "../../constants";
import { useAssetClassificationConfig, useIsAdmin } from "../../hooks";
import { H2 } from "../Headers";
import { Warning } from "../Warning";

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    line-height: 1.5rem;
    background: ${WHITE};
    padding: 20px;
    border-radius: 5px;
    border: 1px solid ${DARK_BG};
`

const adminBadgeAnimation = keyframes`
    0% {
        background: ${PRIMARY_ACCENT};
    }
    25% {
        background: ${WHACKY_ACCENT};
    }
    50% {
        background: ${PRIMARY_ACCENT_LIGHT};
    }
    75% {
        background: ${WHACKY_ACCENT_2};
    }
`

const AdminBadge = styled.div`
    background: ${PRIMARY_ACCENT};
    padding: 5px 10px;
    border-radius: 5px;
    display: inline-block;
    animation: ${adminBadgeAnimation} 2s infinite;
`

export interface ContractConfigProps {
}

export const ContractConfig: FunctionComponent<ContractConfigProps> = () => {
    const { data: config, isLoading, isError, ...rest } = useAssetClassificationConfig()
    const isAdmin = useIsAdmin()

    if (isLoading) {
        return <></>
    }

    if (isError) {
        return <Warning>Error Loading Contract Configuration</Warning>
    }

    return <div>
        <H2>Contract Configuration</H2>
        <Wrapper>
            <div>
                <div>Admin: {config?.admin}</div>
                <div>Base Name: {config?.base_contract_name}</div>
                <div>Is Test: {config?.is_test ? '✅': '❌'}</div>
            </div>
            <div>
                {isAdmin && <AdminBadge>✅&nbsp;&nbsp;&nbsp;You ARE the Admin</AdminBadge>}
            </div>
        </Wrapper>
    </div>
}