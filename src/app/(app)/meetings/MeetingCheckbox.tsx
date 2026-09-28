'use client'

import { useState } from 'react'
import { updateMeetingStatus } from '@/actions/meeting.actions'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function MeetingCheckbox({ meetingId, initialStatus }: { meetingId: string, initialStatus: string }) {
  const [loading, setLoading] = useState(false)
  const isCompleted = initialStatus === 'CONCLUIDA'

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    
    if (loading) return
    
    setLoading(true)
    const newStatus = isCompleted ? 'AGENDADA' : 'CONCLUIDA'
    
    try {
      await updateMeetingStatus(meetingId, newStatus)
      if (newStatus === 'CONCLUIDA') {
        toast.success('Reunião marcada como concluída!')
      } else {
        toast.success('Reunião reaberta!')
      }
    } catch (err) {
      toast.error('Erro ao atualizar status.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "relative z-20 shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all focus:outline-none",
        isCompleted 
          ? "bg-emerald-500 border-emerald-500 text-white" 
          : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted bg-background",
        loading && "opacity-50 cursor-not-allowed"
      )}
      title={isCompleted ? "Marcar como pendente" : "Marcar como concluída"}
    >
      {isCompleted && <Check className="w-4 h-4" strokeWidth={3} />}
    </button>
  )
}
