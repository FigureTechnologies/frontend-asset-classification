import { FunctionComponent, PropsWithChildren } from "react";
import styled from "styled-components";
import { DARK_BG, TRANSPARENT_DARK_BG, WHITE } from "../../constants";

const ModalOverlay = styled.div`
    background: ${TRANSPARENT_DARK_BG};
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const ModalContainer = styled.div`
    padding: 20px;
    border: 1px solid ${DARK_BG};
    background: ${WHITE};
    border-radius: 10px;
    min-width: 1200px;
    max-width: 90%;
    max-height: 90%;
    overflow-y: scroll;
`

interface ModalProps {
    requestClose: () => any
}

export const Modal: FunctionComponent<PropsWithChildren<ModalProps>> = ({ children, requestClose }) => {
    return <ModalOverlay onClick={requestClose}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
            {children}
        </ModalContainer>
    </ModalOverlay>
}