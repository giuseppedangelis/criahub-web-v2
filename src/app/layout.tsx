import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CriaHub - Gestão de Haras',
  description: 'Sistema completo de gestão para criadores de cavalos Mangalarga Marchador',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
