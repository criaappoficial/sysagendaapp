'use client'

import { useState } from 'react'
import { createCategory } from '@/actions/category.actions'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'

export function CategoriesClient({ initialCategories }: { initialCategories: any[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const data: any = {
      name: formData.get('name'),
      color: formData.get('color'),
      active: true,
    }

    try {
      await createCategory(data)
      toast.success('Categoria adicionada!')
      setIsAdding(false)
    } catch(err) {
      toast.error('Erro ao adicionar categoria.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!isAdding && (
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" /> Adicionar Categoria
        </button>
      )}

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-card border p-6 rounded-xl shadow-sm space-y-4 max-w-lg">
          <h3 className="font-semibold text-lg">Nova Categoria</h3>
          <div className="flex gap-4 items-center">
            <input required name="name" placeholder="Nome da categoria" className="flex-1 h-11 px-3 rounded-md border bg-background" />
            <input required type="color" name="color" defaultValue="#3b82f6" className="w-12 h-11 rounded-md border bg-background p-1 cursor-pointer" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 rounded-lg border hover:bg-muted font-medium">Cancelar</button>
            <button disabled={loading} type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90">{loading ? 'Salvando...' : 'Salvar Categoria'}</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {initialCategories.map(category => (
          <div key={category.id} className="bg-card border p-4 rounded-xl shadow-sm flex items-center gap-3">
            <div className="w-6 h-6 rounded-md shadow-inner" style={{ backgroundColor: category.color }} />
            <span className="font-medium truncate">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
