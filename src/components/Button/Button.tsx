import styled from "styled-components"
import { DARK_BG, DARK_TEXT, LIGHT_TEXT } from "../../constants"

export interface ButtonProps {
    secondary?: boolean
}

export const Button = styled.button<ButtonProps>`
    padding: 10px 20px;
    background: ${({ secondary }) => secondary ? 'transparent' : DARK_BG};
    color: ${({ secondary }) => secondary ? DARK_TEXT : LIGHT_TEXT};
    border: ${({ secondary }) => secondary ? `1px solid ${DARK_TEXT}` :'none'};
    border-radius: 5px;
    cursor: pointer;
`