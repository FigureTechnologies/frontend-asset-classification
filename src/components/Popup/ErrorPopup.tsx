import { FunctionComponent, MouseEventHandler } from "react";
import styled from "styled-components";
import { DARK_BG, LIGHT_TEXT, WHACKY_ACCENT_2 } from "../../constants";
import { useError } from "../../hooks";
import { RemoveButton } from "../Button";

const Wrapper = styled.div`
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 20px 40px;
    min-width: 300px;
    max-width: 90%;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background: ${WHACKY_ACCENT_2};
    border: 1px solid ${DARK_BG};
    color: ${LIGHT_TEXT};
    border-bottom: none;
    font-weight: bold;
`

const CloseButton = styled(RemoveButton)`
    position: absolute;
    top: 1rem;
    right: 10px;
    font-size: 1rem;
`

const Overlay = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
`

export interface ErrorPopupProps {
    
}

export const ErrorPopup: FunctionComponent<ErrorPopupProps> = () => {
    const [error, setError] = useError()

    const closePopup: MouseEventHandler<HTMLElement> = (e) => {
        e.stopPropagation()
        setError()
    }

    if (!error) {
        return <></>
    }

    return <Overlay onClick={closePopup}>
        <Wrapper onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closePopup} />
            {error}
        </Wrapper>
    </Overlay>
}