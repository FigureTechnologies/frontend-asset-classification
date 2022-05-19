import { FunctionComponent } from "react"
import styled from "styled-components"
import { LIGHT_BG, MEDIUM_BG, PRIMARY_ACCENT_LIGHT } from "../../constants"
import { Input } from "./Input"

export const InputOrDisplayWrapper = styled.div`

`

export const DisplayWrapper = styled.div`
    padding: 10px;
    background: ${MEDIUM_BG};
    border-radius: 5px;
`

const Label = styled.label`
    display: block;
`

export type InputOrDisplayProps = {
    editable: boolean,
    label: string
} & React.InputHTMLAttributes<HTMLInputElement>

export const InputOrDisplay: FunctionComponent<InputOrDisplayProps> = ({editable, label, value,  ...rest}) => {
    return <InputOrDisplayWrapper>
        <Label>{label}</Label>
        {editable ?
            <Input value={value} {...rest} /> :
            <DisplayWrapper>{value}</DisplayWrapper>
        }
    </InputOrDisplayWrapper>
}