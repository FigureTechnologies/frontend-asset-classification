import styled from "styled-components";
import { DARK_BG, LIGHT_TEXT, WHACKY_ACCENT_2 } from "../../constants";

export const Warning = styled.div`
    margin: 20px 0;
    color: ${LIGHT_TEXT};
    font-size: 1.5rem;
    background: ${WHACKY_ACCENT_2};
    padding: 20px;
    border: 1px solid ${DARK_BG};
    border-radius: 5px;
`