'use client'

import { useState } from 'react'
import { updateSettings } from '@/actions/settings.actions'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

export function SettingsForm({ settings, categories }: { settings: any, categories: any[] }) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const data: any = {
      userProfileName: formData.get('userProfileName'),
      userWhatsapp: formData.get('userWhatsapp'),
      userEmail: formData.get('userEmail'),
      userCompany: formData.get('userCompany'),
      firstDayOfWeek: Number(formData.get('firstDayOfWeek')),
      defaultStartTime: formData.get('defaultStartTime'),
      defaultDurationMinutes: Number(formData.get('defaultDurationMinutes')),
      defaultCategoryId: formData.get('defaultCategoryId') || null,
      theme: formData.get('theme'),
    }

    try {
      await updateSettings(data)
      toast.success('Configurações salvas com sucesso!')
      
      // Update theme locally
      if (data.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (data.theme === 'light') {
        document.documentElement.classList.remove('dark')
      } else {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
      
    } catch (err) {
      toast.error('Erro ao salvar configurações.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="divide-y divide-border">
      
      <div className="p-6 md:p-8 space-y-6">
        <h2 className="text-lg font-semibold text-primary">Seu Perfil</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome de Perfil *</label>
            <input required name="userProfileName" defaultValue={settings.userProfileName} className="w-full h-11 px-3 rounded-md border bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">WhatsApp</label>
            <input name="userWhatsapp" defaultValue={settings.userWhatsapp} className="w-full h-11 px-3 rounded-md border bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">E-mail</label>
            <input name="userEmail" type="email" defaultValue={settings.userEmail} className="w-full h-11 px-3 rounded-md border bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Empresa</label>
            <input name="userCompany" defaultValue={settings.userCompany} className="w-full h-11 px-3 rounded-md border bg-background" />
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6 bg-muted/50">
        <h2 className="text-lg font-semibold text-primary">Preferências de Agendamento</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Primeiro dia da semana</label>
            <select name="firstDayOfWeek" defaultValue={settings.firstDayOfWeek} className="w-full h-11 px-3 rounded-md border bg-background">
              <option value="0">Domingo</option>
              <option value="1">Segunda-feira</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Categoria padrão</label>
            <select name="defaultCategoryId" defaultValue={settings.defaultCategoryId || ""} className="w-full h-11 px-3 rounded-md border bg-background">
              <option value="">Nenhuma</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Horário padrão de início</label>
            <input required type="time" name="defaultStartTime" defaultValue={settings.defaultStartTime} className="w-full h-11 px-3 rounded-md border bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Duração padrão (minutos)</label>
            <input required type="number" name="defaultDurationMinutes" defaultValue={settings.defaultDurationMinutes} className="w-full h-11 px-3 rounded-md border bg-background" />
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        <h2 className="text-lg font-semibold text-primary">Aparência</h2>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tema Visual</label>
            <select name="theme" defaultValue={settings.theme} className="w-full md:w-1/2 h-11 px-3 rounded-md border bg-background">
              <option value="system">Seguir o Sistema</option>
              <option value="light">Claro</option>
              <option value="dark">Escuro</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-muted/30 flex justify-end">
        <button disabled={loading} type="submit" className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
          {loading ? 'Salvando...' : <><Save className="w-4 h-4" /> Salvar Configurações</>}
        </button>
      </div>

    </form>
  )
}
