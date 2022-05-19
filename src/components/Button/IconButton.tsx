import { FunctionComponent } from "react"
import styled from "styled-components"
import { DARK_BG, LIGHT_TEXT } from "../../constants"

export const IconButtonBody = styled.button`
    border-radius: 50%;
    width: 1.5em;
    height: 1.5em;
    font-size: 1.5rem;
    vertical-align: middle;
    border: none;
    background: ${DARK_BG};
    color: ${LIGHT_TEXT};
    cursor: pointer;
    &:hover {
        opacity: .8;
    }
    &:disabled {
        opacity: .5;
        cursor: not-allowed;
    }
`
export const AddButton: FunctionComponent<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => <IconButtonBody {...props}>+</IconButtonBody>
export const RemoveButton: FunctionComponent<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => <IconButtonBody {...props}>x</IconButtonBody>