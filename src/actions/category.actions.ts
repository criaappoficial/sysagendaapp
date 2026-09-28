'use server'

import { prisma } from '@/lib/prisma'
import { categorySchema, type CategoryFormData } from '@/schemas/category.schema'
import { revalidatePath } from 'next/cache'

export async function createCategory(data: CategoryFormData) {
  const validated = categorySchema.parse(data)
  const category = await prisma.category.create({
    data: {
      name: validated.name,
      color: validated.color,
      active: validated.active,
    }
  })
  revalidatePath('/categories')
  return category
}

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })
}
