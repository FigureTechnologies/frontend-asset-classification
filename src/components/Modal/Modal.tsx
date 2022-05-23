import { FunctionComponent, PropsWithChildren } from "react";
import styled from "styled-components";
import { DARK_BG, TRANSPARENT_DARK_BG, WHITE } from "../../constants";
import { RemoveButton } from "../Button";

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
    min-width: min(1200px, 90%);
    max-width: 90%;
    max-height: 90%;
    overflow-y: scroll;
    position: relative;
`

const CloseButton = styled(RemoveButton)`
    font-size: 1rem;
    position: absolute;
    top: 10px;
    right: 10px;
`

interface ModalProps {
    closeable?: boolean,
    requestClose: () => any
}

export const Modal: FunctionComponent<PropsWithChildren<ModalProps>> = ({ children, requestClose, closeable = true }) => {
    return <ModalOverlay onClick={requestClose}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
            {closeable && <CloseButton onClick={requestClose} />}
            {children}
        </ModalContainer>
    </ModalOverlay>
}