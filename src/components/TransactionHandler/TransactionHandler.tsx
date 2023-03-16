import { FunctionComponent } from "react";
import { useCurrentMessage } from "../../hooks/useWrapSendMessage";
import { H1, H2 } from "../Headers";
import { Modal } from "../Modal";

export interface TransactionHandlerProps {
    
}

export const TransactionHandler: FunctionComponent<TransactionHandlerProps> = () => {
    const currentMessage = useCurrentMessage()

    if (!currentMessage) {
        return <></>
    }

    return <Modal closeable={false} requestClose={() => {}}>
        <H1 style={{ marginTop: 0 }}>Open Provenance Wallet to sign transaction</H1>
        <H2>{currentMessage.description}</H2>
    </Modal>
}