import styled from "styled-components"
import { DARK_BG, LIGHT_TEXT } from "../../constants"

export const Button = styled.button`
    padding: 10px 20px;
    background: ${DARK_BG};
    color: ${LIGHT_TEXT};
    border: none;
    border-radius: 5px;
    cursor: pointer;
`