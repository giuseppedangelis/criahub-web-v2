'use client'

import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Com SSR, geralmente queremos um staleTime > 0
                // para evitar refetching imediato no cliente
                staleTime: 60 * 1000, // 1 minuto
                gcTime: 5 * 60 * 1000, // 5 minutos (garbage collection)
                retry: 1,
                refetchOnWindowFocus: true,
                refetchOnReconnect: true,
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
