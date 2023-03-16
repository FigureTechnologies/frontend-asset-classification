import { useWalletConnect } from "@provenanceio/walletconnect-js"
import { Any } from "google-protobuf/google/protobuf/any_pb"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { MSG_EXECUTE_CONTRACT_TYPE } from "../constants"
import { useInvalidateAssetDefinitions } from "./useAssetDefinitions"
import { useError } from "./useError"

interface CurrentMessage {
    message: string | string[],
    description: string
}
const CURRENT_MESSAGE_KEY = ['current-message']
export const useCurrentMessage = () => useQuery<CurrentMessage>(CURRENT_MESSAGE_KEY)

/**
 * NOTE: sendMessage DOES ONCE AGAIN RETURN THE RESULT... LEAVING THIS HERE IN CASE THAT BREAKS AGAIN IN THE FUTURE
 * 
 * Wraps the WalletConnectService sendMessage call in a promise using temporary WalletConnectService listeners, as the
 * sendMessage call does not itself wait for the result of the transaction to be returned
 * 
 * @returns a promise that resolves with the broadcast result or error
 */
export const useWrapSendMessage = () => {
    const { walletConnectService } = useWalletConnect()
    const queryClient = useQueryClient()

    return useMutation(async ({ message, description }: { message: string | string[], description: string }) => {
        const currentMessage: CurrentMessage = {
            message,
            description
        }
        try {
            queryClient.setQueryData(CURRENT_MESSAGE_KEY, currentMessage)
            const result = await walletConnectService.sendMessage(currentMessage)

            if (!result.valid) {
                throw Error(result.error)
            }
    
            return result
        } finally {
            queryClient.setQueryData(CURRENT_MESSAGE_KEY, undefined)
        }
    }
        // new Promise<BroadcastResult>((resolve, reject) => {
            // const listener = (res: BroadcastResult) => {
            //     if (res.data === message) { // this is the message you are looking for
            //         if (res.valid) {
            //             resolve(res)
            //         } else {
            //             reject(res.error)
            //         }

            //         // remove own listener
            //         walletConnectService.removeListener(WINDOW_MESSAGES.SEND_MESSAGE_COMPLETE, listener)
            //         walletConnectService.removeListener(WINDOW_MESSAGES.SEND_MESSAGE_FAILED, listener)
            //     }
            // }
            // walletConnectService.addListener(WINDOW_MESSAGES.SEND_MESSAGE_COMPLETE, listener)
            // walletConnectService.addListener(WINDOW_MESSAGES.SEND_MESSAGE_FAILED, listener)
        //     walletConnectService.sendMessage({
        //         message,
        //         description
        //     })
        // })
    )
}

export interface TransactionMeta {
    txRaw: string,
    txPretty: string,
}

export const useSendACContractMessage = () => {
    const { mutateAsync: sendMessage } = useWrapSendMessage()
    const [, setError] = useError()
    const invalidateAssetDefinitions = useInvalidateAssetDefinitions()

    return useMutation(async ({ tx }: { tx: TransactionMeta }) => {
        try {
            await sendMessage({
                message: Buffer.from(new Any().setTypeUrl(MSG_EXECUTE_CONTRACT_TYPE).setValue(tx.txRaw).serializeBinary()).toString('base64'),
                description: MSG_EXECUTE_CONTRACT_TYPE,
            })
            invalidateAssetDefinitions()
        } catch (e) {
            setError(`Transaction Error: ${e}`)
        }
    }, {})
}

