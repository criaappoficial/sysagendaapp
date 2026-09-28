import { z } from 'zod'

export const meetingSchema = z.object({
  title: z.string().min(2, 'O título deve ter pelo menos 2 caracteres'),
  categoryId: z.string().min(1, 'A categoria é obrigatória'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida (formato YYYY-MM-DD)'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Horário inválido (formato HH:mm)'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Horário inválido (formato HH:mm)'),
  meetingType: z.enum(['PRESENCIAL', 'ONLINE', 'HIBRIDA'], {
    message: 'Tipo de reunião inválido',
  }),
  platform: z.string().optional().nullable(),
  meetingUrl: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
  location: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  complement: z.string().optional().nullable(),
  room: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  reminderMinutes: z.number().int().optional().nullable(),
  recurrence: z.enum(['NONE', 'DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'CUSTOM']).default('NONE'),
  
  // Array of participant IDs or contact form data if creating inline (for simplicity we will use just array of string IDs)
  participantIds: z.array(z.string()).default([]),
  
  // Agenda items text strings
  agendaItems: z.array(z.string().min(1, 'Item não pode ser vazio')).default([]),
}).refine(data => {
  // Validate that endTime is strictly greater than startTime
  const start = data.startTime.split(':').map(Number)
  const end = data.endTime.split(':').map(Number)
  const startTotal = start[0] * 60 + start[1]
  const endTotal = end[0] * 60 + end[1]
  return endTotal > startTotal
}, {
  message: 'Horário final deve ser maior que o inicial',
  path: ['endTime']
})

export type MeetingFormData = z.infer<typeof meetingSchema>
