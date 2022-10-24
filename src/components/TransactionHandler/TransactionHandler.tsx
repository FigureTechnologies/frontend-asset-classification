import { useWalletConnect, WINDOW_MESSAGES } from "@provenanceio/walletconnect-js";
import { BroadcastResults } from "@provenanceio/walletconnect-js/lib/types";
import { BaseResults } from "@provenanceio/walletconnect-js/lib/types/BaseResults";
import { Any } from "google-protobuf/google/protobuf/any_pb";
import { FunctionComponent, useCallback, useEffect } from "react";
import { MSG_EXECUTE_CONTRACT_TYPE } from "../../constants";
import { useError, useInvalidateAssetDefinitions, useTransaction } from "../../hooks";
import { H1, H2 } from "../Headers";
import { Modal } from "../Modal";

export interface TransactionHandlerProps {
    
}

export const TransactionHandler: FunctionComponent<TransactionHandlerProps> = () => {
    const [transaction, setTransaction] = useTransaction()
    const [, setError] = useError()
    const { walletConnectService: wcs } = useWalletConnect()
    const invalidateAssetDefinitions = useInvalidateAssetDefinitions()

    const handleTransaction = useCallback(async (tx: string) => {
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
        const completeListener = (res: BroadcastResults) => {
            setTransaction()
            invalidateAssetDefinitions()
        }
        wcs.addListener(WINDOW_MESSAGES.CUSTOM_ACTION_COMPLETE, completeListener)
        const failedListener = (res: BroadcastResults) => {
            setTransaction()
            setError(`Transaction Error: ${(res as BaseResults).error}`)
        }
        wcs.addListener(WINDOW_MESSAGES.CUSTOM_ACTION_FAILED, failedListener)
        return () => {
            wcs.removeListener(WINDOW_MESSAGES.CUSTOM_ACTION_COMPLETE, completeListener)
            wcs.removeListener(WINDOW_MESSAGES.CUSTOM_ACTION_FAILED, failedListener)
        }
    }, [setTransaction, wcs, setError, invalidateAssetDefinitions])

    if (!transaction) {
        return <></>
    }

    return <Modal closeable={false} requestClose={() => {}}>
        <H1 style={{ marginTop: 0 }}>Open Provenance Wallet to sign transaction</H1>
        <H2>Transaction Message</H2>
        <pre>
            {transaction.txPretty}
        </pre>
    </Modal>
}