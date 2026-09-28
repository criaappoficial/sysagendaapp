import { getMeetingById } from '@/actions/meeting.actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { formatWhatsAppMessage } from '@/lib/whatsapp'
import { ShareClient } from './ShareClient'

export default async function ShareMeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const meeting = await getMeetingById(resolvedParams.id)
  
  if (!meeting) {
    notFound()
  }

  const messageData = {
    title: meeting.title,
    date: meeting.date,
    startTime: meeting.startTime,
    endTime: meeting.endTime,
    meetingType: meeting.meetingType,
    platform: meeting.platform,
    meetingUrl: meeting.meetingUrl,
    location: meeting.location,
    address: meeting.address,
    room: meeting.room,
    complement: meeting.complement,
    participants: meeting.participants.map(mp => mp.participant.name),
    agendaItems: meeting.agendaItems.map(ai => ai.text),
    // we omit notes here normally, unless user wants it. Let's omit it from the invite by default.
  }

  const messageText = formatWhatsAppMessage(messageData)

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <header className="flex items-center gap-4">
        <Link href={`/meetings/${meeting.id}`} className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Compartilhar Convite</h1>
      </header>

      <main className="bg-card border rounded-xl shadow-sm p-6 md:p-8 space-y-8">
        
        <div>
          <h2 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider mb-4">Pré-visualização da Mensagem</h2>
          <div className="bg-[#e5ddd5] dark:bg-[#111b21] p-6 rounded-xl border border-transparent shadow-inner">
            <div className="bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] p-4 rounded-xl rounded-tl-none shadow-sm max-w-xl whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed">
              {messageText}
            </div>
          </div>
        </div>

        <ShareClient message={messageText} participants={meeting.participants} />
      </main>
    </div>
  )
}
