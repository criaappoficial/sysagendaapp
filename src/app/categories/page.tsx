import { getCategories } from '@/actions/category.actions'
import { CategoriesClient } from './CategoriesClient'
import { Tags } from 'lucide-react'

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <header className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Tags className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorias</h1>
          <p className="text-muted-foreground mt-1">Gerencie os tipos de reuniões com cores identificadoras.</p>
        </div>
      </header>

      <main>
        <CategoriesClient initialCategories={categories} />
      </main>
    </div>
  )
}
