'use client'

import { useState } from 'react'
import { createCompany, deleteCompany } from '@/actions/contact.actions'
import { toast } from 'sonner'
import { Plus, Trash2, Phone, Mail, Globe } from 'lucide-react'

export function CompaniesClient({ initialCompanies }: { initialCompanies: any[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data: any = {
      name: formData.get('name'),
      cnpj: formData.get('cnpj'),
      website: formData.get('website'),
      phone: formData.get('phone'),
      email: formData.get('email'),
    }

    try {
      await createCompany(data)
      toast.success('Empresa adicionada!')
      setIsAdding(false)
    } catch(err) {
      toast.error('Erro ao adicionar empresa.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if(confirm('Deseja realmente excluir esta empresa?')) {
      await deleteCompany(id)
      toast.success('Empresa excluída.')
    }
  }

  return (
    <div className="space-y-6">
      {!isAdding && (
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" /> Adicionar Empresa
        </button>
      )}

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-card border p-6 rounded-xl shadow-sm space-y-4">
          <h3 className="font-semibold text-lg">Nova Empresa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required name="name" placeholder="Nome *" className="h-11 px-3 rounded-md border bg-background md:col-span-2" />
            <input name="cnpj" placeholder="CNPJ" className="h-11 px-3 rounded-md border bg-background" />
            <input name="website" placeholder="Site (Ex: https://...)" className="h-11 px-3 rounded-md border bg-background" />
            <input name="phone" placeholder="Telefone principal" className="h-11 px-3 rounded-md border bg-background" />
            <input name="email" type="email" placeholder="E-mail principal" className="h-11 px-3 rounded-md border bg-background" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-lg border hover:bg-muted font-medium">Cancelar</button>
            <button disabled={loading} type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90">{loading ? 'Salvando...' : 'Salvar Empresa'}</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialCompanies.map(company => (
          <div key={company.id} className="bg-card border p-5 rounded-xl shadow-sm flex flex-col group relative">
            <button onClick={() => handleDelete(company.id)} className="absolute top-3 right-3 p-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-4 h-4" />
            </button>
            
            <h3 className="font-bold text-lg mb-4 pr-6">{company.name}</h3>
            
            <div className="mt-auto space-y-2">
              {company.cnpj && <p className="text-sm text-muted-foreground font-mono">CNPJ: {company.cnpj}</p>}
              
              {company.phone && (
                <div className="flex items-center gap-2 text-sm pt-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{company.phone}</span>
                </div>
              )}
              {company.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{company.email}</span>
                </div>
              )}
              {company.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{company.website}</a>
                </div>
              )}
            </div>
          </div>
        ))}
        {initialCompanies.length === 0 && !isAdding && (
          <div className="col-span-full p-8 text-center text-muted-foreground bg-card border rounded-xl">
            Nenhuma empresa cadastrada.
          </div>
        )}
      </div>
    </div>
  )
}
