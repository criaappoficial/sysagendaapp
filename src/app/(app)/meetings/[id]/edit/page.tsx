import { getCategories } from '@/actions/category.actions'
import { getParticipants } from '@/actions/contact.actions'
import { getSettings } from '@/actions/settings.actions'
import { getMeetingById } from '@/actions/meeting.actions'
import { MeetingForm } from '@/components/MeetingForm'
import { Calendar } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function EditMeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const meeting = await getMeetingById(resolvedParams.id)

  if (!meeting) {
    notFound()
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Editar Reunião</h1>
        </div>
        <p className="text-muted-foreground">
          Atualize os dados da sua reunião.
        </p>
      </header>

      <main className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <MeetingForm 
          categories={categories} 
          contacts={contacts} 
          settings={settings}
          initialData={meeting}
        />
      </main>
    </div>
  )
}
