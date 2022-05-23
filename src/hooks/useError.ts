import { useCallback } from "react"
import { useQuery, useQueryClient } from "react-query"

export type Error = string | undefined

export const useError = (): [Error, (error?: Error) => void] => {
    const queryClient = useQueryClient()
    const {data: error} = useQuery(['error'], () => {
        return queryClient.getQueryData<string>(['error'])
    })

    const setError = useCallback((error: Error) => {
        queryClient.setQueryData(['error'], error)
    }, [queryClient])

    return [error, setError]
}