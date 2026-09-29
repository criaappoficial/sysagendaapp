import { getCategories } from '@/actions/category.actions'
import { getParticipants } from '@/actions/contact.actions'
import { getSettings } from '@/actions/settings.actions'
import { MeetingForm } from '@/components/MeetingForm'
import { Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function NewMeetingPage() {
  const categories = await getCategories()
  const contacts = await getParticipants()
  const settings = await getSettings()

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Nova Reunião</h1>
        </div>
        <p className="text-muted-foreground">
          Preencha os dados abaixo para agendar um novo compromisso.
        </p>
      </header>

      <main className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <MeetingForm 
          categories={categories} 
          contacts={contacts} 
          settings={settings}
        />
      </main>
    </div>
  )
}
