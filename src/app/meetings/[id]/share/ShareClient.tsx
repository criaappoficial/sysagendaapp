'use client'

import { createWhatsAppShareUrl } from '@/lib/whatsapp'
import { Copy, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export function ShareClient({ message, participants }: { message: string, participants: any[] }) {
  
  function handleCopy() {
    navigator.clipboard.writeText(message)
    toast.success('Convite copiado para a área de transferência!')
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-3 rounded-xl font-medium hover:bg-secondary/80 transition-colors"
        >
          <Copy className="w-5 h-5" />
          Copiar Convite
        </button>
        <a 
          href={createWhatsAppShareUrl(message)}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-medium hover:bg-[#20bd5a] transition-colors shadow-sm"
        >
          <ExternalLink className="w-5 h-5" />
          Compartilhar Geral
        </a>
      </div>

      {participants.length > 0 && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider mb-4">Enviar para Participantes</h3>
          <ul className="space-y-3">
            {participants.map(mp => {
              const url = createWhatsAppShareUrl(message, mp.participant.whatsapp)
              return (
                <li key={mp.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border">
                  <div>
                    <p className="font-medium">{mp.participant.name}</p>
                    <p className="text-xs text-muted-foreground">{mp.participant.whatsapp}</p>
                  </div>
                  <a 
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-medium bg-background border px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    Enviar <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      )}

    </div>
  )
}
