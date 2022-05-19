import { useCallback } from "react"
import { useNavigate } from "react-router"
import styled from "styled-components"
import { useNetworkConfig } from "../../hooks"
import Switch from 'react-switch'


export const NetworkSwitcherWrapper = styled.div`
    display: flex;
    align-items: center;
    margin: 10px 0;
`

export const NetworkSwitcher = () => {
    const networkConfig = useNetworkConfig()
    const navigate = useNavigate()

    const toggleNetwork = useCallback(() => {
    navigate(`/${networkConfig.network === 'mainnet' ? 'testnet' : 'mainnet'}`)
    }, [networkConfig.network])

    return <NetworkSwitcherWrapper>
        testnet&nbsp;<Switch onChange={toggleNetwork} checked={networkConfig.network === 'mainnet'} checkedIcon={false} uncheckedIcon={false} />&nbsp;mainnet
    </NetworkSwitcherWrapper>
}