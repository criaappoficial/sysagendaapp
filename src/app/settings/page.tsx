import { getSettings } from '@/actions/settings.actions'
import { getCategories } from '@/actions/category.actions'
import { SettingsForm } from './SettingsForm'
import { Settings } from 'lucide-react'

export default async function SettingsPage() {
  const settings = await getSettings()
  const categories = await getCategories()

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <header className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Settings className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground mt-1">Ajuste suas preferências locais.</p>
        </div>
      </header>

      <main className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <SettingsForm settings={settings} categories={categories} />
      </main>
    </div>
  )
}
