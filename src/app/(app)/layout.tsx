import { Sidebar as MainSidebar } from "@/components/MainSidebar"

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <MainSidebar />
      
      <main className="flex-1 md:pl-64 flex flex-col min-h-screen">
        <div className="pt-16 md:pt-0 flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
