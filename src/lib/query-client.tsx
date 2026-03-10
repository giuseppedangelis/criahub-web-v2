'use client'

import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000,
                gcTime: 10 * 60 * 1000,
                retry: 1,
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
            },
            mutations: {
                retry: 1,
            },
        },
    })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
    if (typeof window === 'undefined') {
        // Server: sempre criar um novo query client
        return makeQueryClient()
    } else {
        // Browser: fazer query client uma vez só
        if (!browserQueryClient) browserQueryClient = makeQueryClient()
        return browserQueryClient
    }
}

export function QueryClientProvider({ children }: { children: ReactNode }) {
    // NOTE: Evitar usar useState ao inicializar o query client se você não
    // tiver um suspense boundary entre isso e o componente que pode suspender
    // porque React vai jogar fora o cliente no re-render inicial
    const queryClient = getQueryClient()

    return (
        <TanStackQueryClientProvider client={queryClient}>
            {children}
        </TanStackQueryClientProvider>
    )
}

// Exportar o queryClient para usar em invalidações e prefetching
export { getQueryClient }
