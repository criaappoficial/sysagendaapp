import { z } from 'zod'

export const settingsSchema = z.object({
  userProfileName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  userWhatsapp: z.string().optional().nullable(),
  userEmail: z.string().email('E-mail inválido').optional().nullable().or(z.literal('')),
  userCompany: z.string().optional().nullable(),
  firstDayOfWeek: z.number().int().min(0).max(1).default(0), // 0: Dom, 1: Seg
  defaultStartTime: z.string().regex(/^\d{2}:\d{2}$/, 'Horário inválido').default('09:00'),
  defaultDurationMinutes: z.number().int().positive().default(60),
  defaultCategoryId: z.string().optional().nullable(),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
})

export type SettingsFormData = z.infer<typeof settingsSchema>
