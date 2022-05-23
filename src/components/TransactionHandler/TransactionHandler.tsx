import { useWalletConnect, WINDOW_MESSAGES } from "@provenanceio/walletconnect-js";
import { Any } from "google-protobuf/google/protobuf/any_pb";
import { FunctionComponent, useCallback, useEffect } from "react";
import { MSG_EXECUTE_CONTRACT_TYPE } from "../../constants";
import { useError, useTransaction } from "../../hooks";
import { H1, H2 } from "../Headers";
import { Modal } from "../Modal";

export interface TransactionHandlerProps {
    
}

export const TransactionHandler: FunctionComponent<TransactionHandlerProps> = () => {
    const [transaction, setTransaction] = useTransaction()
    const [, setError] = useError()
    const { walletConnectService: wcs } = useWalletConnect()

    const handleTransaction = useCallback(async (tx: string) => {
        console.log('handling transaction')
        try {
            await wcs.customAction({
                message: Buffer.from(new Any().setTypeUrl(MSG_EXECUTE_CONTRACT_TYPE).setValue(tx).serializeBinary()).toString('base64'),
                description: MSG_EXECUTE_CONTRACT_TYPE,
                method: 'provenance_sendTransaction',
            })
        } catch (e) {
    
        }
    }, [wcs])

    // todo: listeners to close

    useEffect(() => {
        if (transaction) {
            handleTransaction(transaction.txRaw)
        }
    }, [transaction, handleTransaction])

    useEffect(() => {
        wcs.addListener(WINDOW_MESSAGES.CUSTOM_ACTION_COMPLETE, (res) => {
            console.log('CUSTOM_ACTION_COMPLETE', res)
            setTransaction()
        })
        wcs.addListener(WINDOW_MESSAGES.CUSTOM_ACTION_FAILED, (res) => {
            console.log('CUSTOM_ACTION_FAILED', res)
            setTransaction()
            setError(`Transaction Error: ${res.error}`)
        })
        console.log('listeners registered')
        return () => wcs.removeAllListeners()
    }, [setTransaction, wcs, setError])

    if (!transaction) {
        return <></>
    }

    return <Modal requestClose={() => {}}>
        <H1 style={{ marginTop: 0 }}>Open Provenance Wallet to sign transaction</H1>
        <H2>Transaction Message</H2>
        <pre>
            {transaction.txPretty}
        </pre>
    </Modal>
}