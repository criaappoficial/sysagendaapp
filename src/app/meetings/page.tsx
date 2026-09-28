import { getMeetings } from '@/actions/meeting.actions'
import { getCategories } from '@/actions/category.actions'
import Link from 'next/link'
import { Calendar, Plus, Search, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDateBR, formatTimeRange } from '@/lib/date'

export default async function MeetingsListPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const categories = await getCategories()
  
  // Use searchParams to filter
  const categoryId = searchParams.category
  const status = searchParams.status
  const date = searchParams.date
  const q = searchParams.q?.toLowerCase()

  let meetings = await getMeetings({ categoryId, status, date })

  if (q) {
    meetings = meetings.filter(m => 
      m.title.toLowerCase().includes(q) || 
      m.description?.toLowerCase().includes(q) || 
      m.participants.some(p => p.participant.name.toLowerCase().includes(q))
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reuniões</h1>
            <p className="text-muted-foreground mt-1">Gerencie todos os seus compromissos.</p>
          </div>
        </div>
        <Link 
          href="/meetings/new"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Nova Reunião
        </Link>
      </header>

      {/* Filters */}
      <form className="bg-card border p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Busca</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              name="q" 
              defaultValue={q}
              placeholder="Buscar por título, participante..." 
              className="w-full h-10 pl-9 pr-3 rounded-lg border bg-background text-sm"
            />
          </div>
        </div>
        
        <div className="w-full md:w-48 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Data</label>
          <input 
            type="date" 
            name="date" 
            defaultValue={date}
            className="w-full h-10 px-3 rounded-lg border bg-background text-sm"
          />
        </div>

        <div className="w-full md:w-48 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Categoria</label>
          <select name="category" defaultValue={categoryId} className="w-full h-10 px-3 rounded-lg border bg-background text-sm">
            <option value="">Todas</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-48 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Status</label>
          <select name="status" defaultValue={status} className="w-full h-10 px-3 rounded-lg border bg-background text-sm">
            <option value="">Todos</option>
            <option value="AGENDADA">Agendada</option>
            <option value="CONFIRMADA">Confirmada</option>
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="CONCLUIDA">Concluída</option>
            <option value="CANCELADA">Cancelada</option>
            <option value="REAGENDADA">Reagendada</option>
          </select>
        </div>

        <button type="submit" className="h-10 px-4 bg-secondary text-secondary-foreground rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-secondary/80">
          <Filter className="w-4 h-4" />
          Filtrar
        </button>
      </form>

      {/* List */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        {meetings.length > 0 ? (
          <div className="divide-y">
            {meetings.map(meeting => (
              <Link 
                key={meeting.id}
                href={`/meetings/${meeting.id}`}
                className="flex flex-col md:flex-row md:items-center gap-4 p-4 hover:bg-muted/50 transition-colors group relative"
              >
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: meeting.category.color }}
                />
                
                <div className="flex-1 min-w-0 pl-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm"
                      style={{ 
                        color: meeting.category.color,
                        backgroundColor: `${meeting.category.color}15`
                      }}
                    >
                      {meeting.category.name}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm border",
                      meeting.status === 'CONFIRMADA' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      meeting.status === 'AGENDADA' ? "bg-blue-50 text-blue-700 border-blue-200" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    )}>
                      {meeting.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-lg truncate">
                    {meeting.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                    <span>{formatDateBR(meeting.date)}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{formatTimeRange(meeting.startTime, meeting.endTime)}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{meeting.meetingType}</span>
                  </div>
                </div>

                <div className="pl-2 md:pl-0 flex items-center gap-2">
                  {meeting.participants.length > 0 && (
                    <div className="flex -space-x-2">
                      {meeting.participants.slice(0, 3).map((mp, i) => (
                        <div key={mp.id} className="w-8 h-8 rounded-full border-2 border-card bg-primary/10 flex items-center justify-center text-primary text-xs font-bold uppercase z-10" style={{ zIndex: 3 - i }}>
                          {mp.participant.name.charAt(0)}
                        </div>
                      ))}
                      {meeting.participants.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-muted-foreground text-xs font-bold uppercase z-0">
                          +{meeting.participants.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Nenhuma reunião encontrada</h3>
            <p className="text-muted-foreground mt-1">Ajuste os filtros ou crie uma nova reunião.</p>
          </div>
        )}
      </div>
    </div>
  )
}
