import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida (formato #HEX)'),
  active: z.boolean().default(true),
})

export type CategoryFormData = z.infer<typeof categorySchema>
