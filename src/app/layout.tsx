import type { Metadata } from "next"
import { Comfortaa } from "next/font/google"
import "./globals.css"
import { Sidebar } from "@/components/Sidebar"
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
        <div className="min-h-screen bg-background text-foreground flex">
          <Sidebar />
          
          <main className="flex-1 md:pl-64 flex flex-col min-h-screen">
            <div className="pt-16 md:pt-0 flex-1">
              {children}
            </div>
          </main>
        </div>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
