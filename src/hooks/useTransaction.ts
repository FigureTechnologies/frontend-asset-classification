import { useCallback } from "react"
import { useQuery, useQueryClient } from "react-query"

export interface TransactionMeta {
    txRaw: string,
    txPretty: string,
}

export const useTransaction = (): [TransactionMeta | undefined, (tx?: TransactionMeta | undefined) => void] => {
    const queryClient = useQueryClient()
    const { data: transaction } = useQuery(['transaction'], () => {
        return queryClient.getQueryData<TransactionMeta>(['transaction'])
    })

    const setTransaction = useCallback((transaction: TransactionMeta | undefined = undefined) => {
        queryClient.setQueryData(['transaction'], transaction)
    }, [queryClient])

    return [transaction, setTransaction]
}