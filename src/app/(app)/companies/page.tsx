import { getCompanies } from '@/actions/contact.actions'
import { CompaniesClient } from './CompaniesClient'
import { Building2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CompaniesPage() {
  const companies = await getCompanies()

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <header className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground mt-1">Gerencie as empresas relacionadas aos seus contatos.</p>
        </div>
      </header>

      <main>
        <CompaniesClient initialCompanies={companies} />
      </main>
    </div>
  )
}
