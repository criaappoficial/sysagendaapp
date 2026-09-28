import { getParticipants } from '@/actions/contact.actions'
import { getCompanies } from '@/actions/contact.actions'
import { ContactsClient } from './ContactsClient'
import { Users } from 'lucide-react'

export default async function ContactsPage() {
  const contacts = await getParticipants()
  const companies = await getCompanies()

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <header className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contatos</h1>
          <p className="text-muted-foreground mt-1">Gerencie as pessoas que participam das suas reuniões.</p>
        </div>
      </header>

      <main>
        <ContactsClient initialContacts={contacts} companies={companies} />
      </main>
    </div>
  )
}
