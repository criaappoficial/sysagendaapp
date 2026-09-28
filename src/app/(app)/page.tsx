import { getSettings } from '@/actions/settings.actions'
import { getMeetings } from '@/actions/meeting.actions'
import { getTodayDateString, formatDateBR, formatTimeRange } from '@/lib/date'
import Link from 'next/link'
import { Calendar, CheckCircle2, Clock, CalendarDays, ArrowRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function DashboardPage() {
  const settings = await getSettings()
  const todayStr = getTodayDateString()
  
  // Fetch all meetings to calculate stats (in a real app we'd use aggregations, but since it's local SQLite we can just fetch and filter memory)
  const allMeetings = await getMeetings()
  
  // Calculate today
  const todayMeetings = allMeetings.filter(m => m.date === todayStr)
  
  // Calculate week (simple approximation for now: next 7 days including today)
  const todayObj = new Date(todayStr + 'T00:00:00')
  const nextWeekObj = new Date(todayObj)
  nextWeekObj.setDate(todayObj.getDate() + 7)
  
  const weekMeetings = allMeetings.filter(m => {
    const d = new Date(m.date + 'T00:00:00')
    return d >= todayObj && d < nextWeekObj
  })
  
  // Calculate stats
  const pendingCount = allMeetings.filter(m => m.status === 'AGENDADA' || m.status === 'REAGENDADA').length
  const confirmedCount = allMeetings.filter(m => m.status === 'CONFIRMADA').length
  
  // Next meeting (closest in time that is today or future, and not canceled/concluded)
  const upcomingMeetings = allMeetings
    .filter(m => (m.status !== 'CANCELADA' && m.status !== 'CONCLUIDA'))
    .filter(m => {
      const dt = new Date(`${m.date}T${m.startTime}:00`)
      return dt > new Date()
    })
    .sort((a, b) => {
      const dtA = new Date(`${a.date}T${a.startTime}:00`).getTime()
      const dtB = new Date(`${b.date}T${b.startTime}:00`).getTime()
      return dtA - dtB
    })
    
  const nextMeeting = upcomingMeetings[0]

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Olá, {settings?.userProfileName || 'Luiz'}</h1>
          <p className="text-muted-foreground mt-1">Aqui está o resumo da sua agenda.</p>
        </div>
        <Link 
          href="/meetings/new"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Calendar className="w-4 h-4" />
          Nova Reunião
        </Link>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard 
          title="Hoje" 
          value={todayMeetings.length} 
          subtitle="Reuniões hoje"
          icon={<CalendarDays className="w-5 h-5 text-blue-500" />}
        />
        <StatsCard 
          title="Esta semana" 
          value={weekMeetings.length} 
          subtitle="Próximos 7 dias"
          icon={<Calendar className="w-5 h-5 text-indigo-500" />}
        />
        <StatsCard 
          title="Confirmadas" 
          value={confirmedCount} 
          subtitle="Total confirmadas"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
        />
        <StatsCard 
          title="Pendentes" 
          value={pendingCount} 
          subtitle="Aguardando ação"
          icon={<Clock className="w-5 h-5 text-amber-500" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Next Meeting Highlight */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Próxima Reunião</h2>
            {nextMeeting && (
              <Link href="/meetings" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                Ver todas <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
          
          {nextMeeting ? (
            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
              <div 
                className="h-2 w-full" 
                style={{ backgroundColor: nextMeeting.category.color }}
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span 
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3 border"
                      style={{ 
                        color: nextMeeting.category.color,
                        borderColor: `${nextMeeting.category.color}40`,
                        backgroundColor: `${nextMeeting.category.color}10`
                      }}
                    >
                      {nextMeeting.category.name}
                    </span>
                    <h3 className="text-2xl font-bold">{nextMeeting.title}</h3>
                  </div>
                  <span className={cn(
                    "px-3 py-1 text-xs font-semibold rounded-full border",
                    nextMeeting.status === 'CONFIRMADA' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    nextMeeting.status === 'AGENDADA' ? "bg-blue-50 text-blue-700 border-blue-200" :
                    "bg-amber-50 text-amber-700 border-amber-200"
                  )}>
                    {nextMeeting.status}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>
                      {nextMeeting.date === todayStr ? 'Hoje' : formatDateBR(nextMeeting.date)}
                    </span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatTimeRange(nextMeeting.startTime, nextMeeting.endTime)}</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
                  <div className="flex items-center gap-2 text-primary font-medium">
                    {nextMeeting.meetingType === 'ONLINE' ? 'Online' : 
                     nextMeeting.meetingType === 'PRESENCIAL' ? 'Presencial' : 'Híbrida'}
                    {nextMeeting.platform && ` · ${nextMeeting.platform}`}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link 
                    href={`/meetings/${nextMeeting.id}`}
                    className="flex-1 bg-muted hover:bg-muted/80 text-foreground py-2.5 rounded-lg text-sm font-medium text-center transition-colors border"
                  >
                    Ver detalhes
                  </Link>
                  <Link 
                    href={`/meetings/${nextMeeting.id}/share`}
                    className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 rounded-lg text-sm font-medium text-center transition-colors flex items-center justify-center gap-2"
                  >
                    WhatsApp
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border rounded-xl p-8 text-center shadow-sm">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Sua agenda está livre</h3>
              <p className="text-muted-foreground mt-1">Você não tem reuniões futuras agendadas.</p>
              <Link 
                href="/meetings/new"
                className="inline-block mt-4 text-primary font-medium hover:underline"
              >
                Agendar primeira reunião
              </Link>
            </div>
          )}
        </div>

        {/* Today/Recent list */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Reuniões de Hoje</h2>
          
          <div className="bg-card border rounded-xl shadow-sm p-1">
            {todayMeetings.length > 0 ? (
              <div className="divide-y">
                {todayMeetings.map(meeting => (
                  <Link 
                    key={meeting.id}
                    href={`/meetings/${meeting.id}`}
                    className="flex items-start gap-4 p-3 hover:bg-muted/50 transition-colors rounded-lg group"
                  >
                    <div 
                      className="w-1.5 h-12 rounded-full shrink-0" 
                      style={{ backgroundColor: meeting.category.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate text-foreground group-hover:text-primary transition-colors">
                        {meeting.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {meeting.startTime} - {meeting.endTime}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground">
                Nenhuma reunião hoje.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatsCard({ title, value, subtitle, icon }: { title: string, value: number | string, subtitle: string, icon: React.ReactNode }) {
  return (
    <div className="bg-card p-5 rounded-xl border shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-muted-foreground text-sm">{title}</h3>
        <div className="p-2 bg-muted rounded-md">
          {icon}
        </div>
      </div>
      <div className="mt-2">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </div>
    </div>
  )
}
