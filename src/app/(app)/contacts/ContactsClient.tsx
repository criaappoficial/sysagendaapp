'use client'

import { useState } from 'react'
import { createParticipant, deleteParticipant } from '@/actions/contact.actions'
import { toast } from 'sonner'
import { Plus, Trash2, Phone, Mail, Building } from 'lucide-react'

export function ContactsClient({ initialContacts, companies }: { initialContacts: any[], companies: any[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')

  const formatPhone = (val: string) => {
    let v = val.replace(/\D/g, '')
    if (v.startsWith('55')) v = v.slice(2)
    if (v.length > 11) v = v.slice(0, 11)
    
    if (v.length === 0) return ''
    if (v.length <= 2) return `+55 ${v}`
    if (v.length <= 6) return `+55 ${v.slice(0,2)} ${v.slice(2)}`
    if (v.length === 10) return `+55 ${v.slice(0,2)} ${v.slice(2,6)}-${v.slice(6,10)}`
    return `+55 ${v.slice(0,2)} ${v.slice(2,7)}-${v.slice(7,11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value))
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data: any = {
      name: formData.get('name'),
      whatsapp: phone, // using the masked value
      email: formData.get('email'),
      companyId: formData.get('companyId') || null,
      role: formData.get('role'),
    }

    try {
      await createParticipant(data)
      toast.success('Contato adicionado!')
      setIsAdding(false)
      setPhone('')
    } catch(err) {
      toast.error('Erro ao adicionar contato.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if(confirm('Deseja realmente excluir este contato?')) {
      await deleteParticipant(id)
      toast.success('Contato excluído.')
    }
  }

  return (
    <div className="space-y-6">
      {!isAdding && (
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" /> Adicionar Contato
        </button>
      )}

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-card border p-6 rounded-xl shadow-sm space-y-4">
          <h3 className="font-semibold text-lg">Novo Contato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required name="name" placeholder="Nome *" className="h-11 px-3 rounded-md border bg-background" />
            <input 
              required 
              name="whatsapp" 
              value={phone}
              onChange={handlePhoneChange}
              placeholder="WhatsApp *" 
              className="h-11 px-3 rounded-md border bg-background" 
            />
            <input name="email" type="email" placeholder="E-mail" className="h-11 px-3 rounded-md border bg-background" />
            <select name="companyId" className="h-11 px-3 rounded-md border bg-background">
              <option value="">Sem empresa vinculada</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input name="role" placeholder="Cargo" className="h-11 px-3 rounded-md border bg-background md:col-span-2" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => { setIsAdding(false); setPhone(''); }} className="px-4 py-2 rounded-lg border hover:bg-muted font-medium">Cancelar</button>
            <button disabled={loading} type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90">{loading ? 'Salvando...' : 'Salvar Contato'}</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialContacts.map(contact => (
          <div key={contact.id} className="bg-card border p-5 rounded-xl shadow-sm flex flex-col group relative">
            <button onClick={() => handleDelete(contact.id)} className="absolute top-3 right-3 p-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-4 h-4" />
            </button>
            
            <h3 className="font-bold text-lg">{contact.name}</h3>
            {contact.role && <p className="text-sm text-muted-foreground mb-3">{contact.role}</p>}
            
            <div className="mt-auto space-y-2 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{contact.whatsapp}</a>
              </div>
              {contact.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{contact.email}</span>
                </div>
              )}
              {contact.company && (
                <div className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span>{contact.company.name}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {initialContacts.length === 0 && !isAdding && (
          <div className="col-span-full p-8 text-center text-muted-foreground bg-card border rounded-xl">
            Nenhum contato cadastrado.
          </div>
        )}
      </div>
    </div>
  )
}
