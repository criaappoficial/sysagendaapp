import { z } from 'zod'

export const participantSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  whatsapp: z.string().min(8, 'WhatsApp inválido').regex(/^[\d\s()+-]+$/, 'Apenas números e símbolos permitidos no WhatsApp'),
  email: z.string().email('E-mail inválido').optional().nullable().or(z.literal('')),
  companyId: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export type ParticipantFormData = z.infer<typeof participantSchema>
