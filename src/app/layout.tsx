import type { Metadata } from "next"
import { Comfortaa } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const comfortaa = Comfortaa({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SysAgenda - Suas reuniões organizadas",
  description: "Sistema local de agendamento e organização de reuniões",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={comfortaa.className}>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
