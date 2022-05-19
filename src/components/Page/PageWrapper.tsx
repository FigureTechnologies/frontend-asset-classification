import { FunctionComponent, PropsWithChildren } from "react";
import styled from 'styled-components'
import { LIGHT_BG } from "../../constants";

const Body = styled.div`
    background: ${LIGHT_BG};
    width: 100vw;
    height: 100vh;
    position: fixed;
    overflow-y: scroll;
`

const Content = styled.div`
    max-width: 1200px;
    margin: 20px auto;
`

interface PageWrapperProps {

}

export const PageWrapper: FunctionComponent<PropsWithChildren<PageWrapperProps>> = ({children}) => <Body>
    <Content>
        {children}
    </Content>
</Body>