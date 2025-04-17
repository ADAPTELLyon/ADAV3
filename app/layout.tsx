import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'ADAPTEL',
  description: 'Application de gestion des plannings et commandes',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  )
}
