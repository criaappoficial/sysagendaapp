'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createMeeting, updateMeeting } from '@/actions/meeting.actions'
import { toast } from 'sonner'
import { Plus, X, MapPin, Video, Users, AlignLeft, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MeetingForm({ 
  categories, 
  contacts, 
  settings,
  initialData 
}: { 
  categories: any[], 
  contacts: any[], 
  settings: any,
  initialData?: any
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [type, setType] = useState(initialData?.meetingType || 'ONLINE')
  const [agenda, setAgenda] = useState<string[]>(initialData?.agendaItems?.map((a: any) => a.text) || [])
  const [newAgendaItem, setNewAgendaItem] = useState('')
  const [selectedContacts, setSelectedContacts] = useState<string[]>(initialData?.participants?.map((p: any) => p.participantId) || [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data: any = {
      title: formData.get('title'),
      categoryId: formData.get('categoryId') || settings?.defaultCategoryId || categories[0]?.id,
      date: formData.get('date'),
      startTime: formData.get('startTime'),
      endTime: formData.get('endTime'),
      meetingType: type,
      description: formData.get('description'),
      notes: formData.get('notes'),
      reminderMinutes: 15,
      recurrence: 'NONE',
      participantIds: selectedContacts,
      agendaItems: agenda
    }

    if (type === 'ONLINE' || type === 'HIBRIDA') {
      data.platform = formData.get('platform')
      data.meetingUrl = formData.get('meetingUrl')
    }
    if (type === 'PRESENCIAL' || type === 'HIBRIDA') {
      data.location = formData.get('location')
      data.address = formData.get('address')
      data.complement = formData.get('complement')
      data.room = formData.get('room')
    }

    try {
      const isEdit = !!initialData?.id
      const result = isEdit 
        ? await updateMeeting(initialData.id, data)
        : await createMeeting(data)
        
      if (result && 'error' in result) {
        toast.error(result.error)
        setLoading(false)
        return
      }
      toast.success(isEdit ? 'Reunião atualizada com sucesso!' : 'Reunião criada com sucesso!')
      router.push(isEdit ? `/meetings/${initialData.id}` : '/')
    } catch (err: any) {
      toast.error('Erro ao salvar reunião. Verifique os dados e tente novamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function addAgendaItem() {
    if (newAgendaItem.trim()) {
      setAgenda([...agenda, newAgendaItem.trim()])
      setNewAgendaItem('')
    }
  }

  function toggleContact(id: string) {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(c => c !== id))
    } else {
      setSelectedContacts([...selectedContacts, id])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="divide-y divide-border">
      
      {/* Informações Principais */}
      <div className="p-6 md:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Info className="w-5 h-5 text-primary" />
          Informações Principais
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Título da reunião *</label>
            <input required name="title" defaultValue={initialData?.title} className="w-full h-11 px-3 rounded-md border bg-background" placeholder="Ex: Alinhamento de Projeto" autoFocus />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria *</label>
            <select name="categoryId" className="w-full h-11 px-3 rounded-md border bg-background" defaultValue={initialData?.categoryId || settings?.defaultCategoryId || ""}>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Data *</label>
            <input required type="date" name="date" defaultValue={initialData?.date} className="w-full h-11 px-3 rounded-md border bg-background" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Horário de Início *</label>
            <input required type="time" name="startTime" defaultValue={initialData?.startTime || settings?.defaultStartTime || "09:00"} className="w-full h-11 px-3 rounded-md border bg-background" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Horário de Término *</label>
            <input required type="time" name="endTime" defaultValue={initialData?.endTime || "10:00"} className="w-full h-11 px-3 rounded-md border bg-background" />
          </div>
        </div>
      </div>

      {/* Tipo e Local */}
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <MapPin className="w-5 h-5 text-primary" />
          Local e Formato
        </div>
        
        <div className="flex gap-4 mb-6">
          {['ONLINE', 'PRESENCIAL', 'HIBRIDA'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-2",
                type === t 
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              {t === 'ONLINE' ? <Video className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
              {t === 'HIBRIDA' ? 'Híbrida' : t === 'ONLINE' ? 'Online' : 'Presencial'}
            </button>
          ))}
        </div>

        {/* Conditional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(type === 'ONLINE' || type === 'HIBRIDA') && (
            <>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Plataforma</label>
                <select name="platform" className="w-full h-11 px-3 rounded-md border bg-background" defaultValue={initialData?.platform || "Google Meet"}>
                  <option>Google Meet</option>
                  <option>Zoom</option>
                  <option>Microsoft Teams</option>
                  <option>WhatsApp</option>
                  <option>Outra</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Link da Reunião</label>
                <input type="url" name="meetingUrl" defaultValue={initialData?.meetingUrl || ""} placeholder="https://meet.google.com/..." className="w-full h-11 px-3 rounded-md border bg-background" />
              </div>
            </>
          )}

          {(type === 'PRESENCIAL' || type === 'HIBRIDA') && (
            <>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Local (Nome)</label>
                <input name="location" defaultValue={initialData?.location || ""} placeholder="Ex: Escritório Sede" className="w-full h-11 px-3 rounded-md border bg-background" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Endereço</label>
                <input name="address" defaultValue={initialData?.address || ""} placeholder="Av. Paulista, 1000" className="w-full h-11 px-3 rounded-md border bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Complemento</label>
                <input name="complement" defaultValue={initialData?.complement || ""} placeholder="Andar 5" className="w-full h-11 px-3 rounded-md border bg-background" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sala</label>
                <input name="room" defaultValue={initialData?.room || ""} placeholder="Sala C" className="w-full h-11 px-3 rounded-md border bg-background" />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Participantes */}
      <div className="p-6 md:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Users className="w-5 h-5 text-primary" />
          Participantes
        </div>
        
        {contacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {contacts.map(contact => (
              <label 
                key={contact.id} 
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                  selectedContacts.includes(contact.id) 
                    ? "bg-primary/5 border-primary" 
                    : "bg-background hover:bg-muted"
                )}
              >
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-primary rounded border-border focus:ring-primary"
                  checked={selectedContacts.includes(contact.id)}
                  onChange={() => toggleContact(contact.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{contact.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{contact.company?.name || 'Sem empresa'}</p>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground p-4 bg-background border rounded-lg text-center">
            Nenhum contato cadastrado. Adicione contatos primeiro para vinculá-los às reuniões.
          </div>
        )}
      </div>

      {/* Pauta */}
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <AlignLeft className="w-5 h-5 text-primary" />
          Pauta e Detalhes
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descrição (Objetivo geral)</label>
          <textarea name="description" defaultValue={initialData?.description || ""} rows={3} className="w-full p-3 rounded-md border bg-background resize-none" placeholder="Qual o objetivo principal desta reunião?" />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium">Itens da Pauta</label>
          
          {agenda.length > 0 && (
            <ul className="space-y-2">
              {agenda.map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-2 bg-muted p-2.5 rounded-md text-sm">
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-muted-foreground text-xs">{i+1}.</span>
                    {item}
                  </span>
                  <button type="button" onClick={() => setAgenda(agenda.filter((_, index) => index !== i))} className="text-muted-foreground hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-2">
            <input 
              value={newAgendaItem}
              onChange={e => setNewAgendaItem(e.target.value)}
              onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); addAgendaItem() } }}
              placeholder="Adicionar item na pauta..." 
              className="flex-1 h-11 px-3 rounded-md border bg-background" 
            />
            <button 
              type="button" 
              onClick={addAgendaItem}
              className="h-11 px-4 bg-secondary border hover:bg-muted rounded-md font-medium text-sm transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Observações internas</label>
          <textarea name="notes" defaultValue={initialData?.notes || ""} rows={2} className="w-full p-3 rounded-md border bg-background resize-none" placeholder="Apenas você verá isso..." />
        </div>
      </div>

      <div className="p-6 md:p-8 bg-muted/30 flex justify-end gap-3 rounded-b-xl">
        <button type="button" onClick={() => router.back()} className="px-5 py-2.5 rounded-lg border bg-background hover:bg-muted font-medium transition-colors">
          Cancelar
        </button>
        <button disabled={loading} type="submit" className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
          {loading ? 'Salvando...' : 'Salvar Reunião'}
        </button>
      </div>

    </form>
  )
}
