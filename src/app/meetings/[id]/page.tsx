import { getMeetingById, updateMeetingStatus } from '@/actions/meeting.actions'
import { notFound } from 'next/navigation'
import { formatDateBR, formatTimeRange } from '@/lib/date'
import Link from 'next/link'
import { ArrowLeft, Edit, ExternalLink, Trash2, CalendarDays, Clock, MapPin, Video, Users, AlignLeft, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function MeetingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const meeting = await getMeetingById(resolvedParams.id)
  
  if (!meeting) {
    notFound()
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <header className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="flex items-center gap-3">
            <span 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: meeting.category.color }}
            />
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              {meeting.category.name}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href={`/meetings/${meeting.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium transition-colors text-sm"
          >
            <Edit className="w-4 h-4" /> Editar
          </Link>
          <Link 
            href={`/meetings/${meeting.id}/share`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] text-white hover:bg-[#20bd5a] font-medium transition-colors text-sm"
          >
            <ExternalLink className="w-4 h-4" /> WhatsApp
          </Link>
        </div>
      </header>

      <main className="bg-card border rounded-xl shadow-sm overflow-hidden relative">
        <div 
          className="absolute top-0 left-0 right-0 h-2" 
          style={{ backgroundColor: meeting.category.color }}
        />
        
        <div className="p-6 md:p-8 space-y-8 mt-2">
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold">{meeting.title}</h1>
              <span className={cn(
                "px-3 py-1 text-xs font-semibold rounded-full border",
                meeting.status === 'CONFIRMADA' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                meeting.status === 'AGENDADA' ? "bg-blue-50 text-blue-700 border-blue-200" :
                "bg-amber-50 text-amber-700 border-amber-200"
              )}>
                {meeting.status}
              </span>
            </div>
            
            {meeting.description && (
              <p className="text-muted-foreground text-lg">{meeting.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-xl border">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-card rounded-lg shadow-sm border text-primary">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data</p>
                <p className="font-semibold">{formatDateBR(meeting.date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-card rounded-lg shadow-sm border text-primary">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Horário</p>
                <p className="font-semibold">{formatTimeRange(meeting.startTime, meeting.endTime)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:col-span-2">
              <div className="p-3 bg-card rounded-lg shadow-sm border text-primary">
                {meeting.meetingType === 'ONLINE' ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Local / Formato</p>
                <div className="font-semibold">
                  {meeting.meetingType === 'ONLINE' ? 'Online' : meeting.meetingType === 'PRESENCIAL' ? 'Presencial' : 'Híbrida'}
                  {meeting.platform && <span className="text-muted-foreground font-normal ml-1">via {meeting.platform}</span>}
                </div>
                {meeting.meetingUrl && (
                  <a href={meeting.meetingUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm break-all mt-1 block">
                    {meeting.meetingUrl}
                  </a>
                )}
                {(meeting.location || meeting.address) && (
                  <p className="text-sm mt-1">
                    {meeting.location && <span className="font-medium mr-1">{meeting.location}</span>}
                    {meeting.address} {meeting.complement && `- ${meeting.complement}`} {meeting.room && `(Sala: ${meeting.room})`}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                <Users className="w-5 h-5 text-primary" />
                Participantes
              </div>
              
              {meeting.participants.length > 0 ? (
                <ul className="space-y-3">
                  {meeting.participants.map(mp => (
                    <li key={mp.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm uppercase">
                        {mp.participant.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{mp.participant.name}</p>
                        <p className="text-xs text-muted-foreground">{mp.participant.company?.name || mp.participant.whatsapp}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">Nenhum participante adicionado.</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold border-b pb-2">
                <AlignLeft className="w-5 h-5 text-primary" />
                Pauta
              </div>
              
              {meeting.agendaItems.length > 0 ? (
                <ul className="space-y-3">
                  {meeting.agendaItems.map(item => (
                    <li key={item.id} className="flex gap-3 text-sm">
                      <span className="font-mono text-muted-foreground shrink-0">{item.itemOrder + 1}.</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">Nenhuma pauta definida.</p>
              )}
            </div>
          </div>

          {meeting.notes && (
            <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 p-4 rounded-lg border border-amber-200 dark:border-amber-900/50 mt-8">
              <p className="font-semibold text-sm mb-1 uppercase tracking-wide">Observações Internas</p>
              <p className="text-sm">{meeting.notes}</p>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
