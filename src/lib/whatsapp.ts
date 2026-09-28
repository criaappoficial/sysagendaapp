import { formatDateBR } from './date'

export interface WhatsAppMeetingData {
  title: string
  date: string
  startTime: string
  endTime: string
  meetingType: string
  platform?: string | null
  meetingUrl?: string | null
  location?: string | null
  address?: string | null
  room?: string | null
  complement?: string | null
  participants: string[]
  agendaItems: string[]
  notes?: string | null
}

export function formatWhatsAppMessage(data: WhatsAppMeetingData): string {
  const parts: string[] = []

  parts.push('📅 *REUNIÃO AGENDADA*')
  parts.push('')
  parts.push(`*Reunião:* ${data.title}`)
  parts.push(`*Data:* ${formatDateBR(data.date)}`)
  parts.push(`*Horário:* ${data.startTime} às ${data.endTime}`)
  
  // Tipo e Local/Link
  let tipoFormatado = ''
  if (data.meetingType === 'PRESENCIAL') tipoFormatado = 'Presencial'
  if (data.meetingType === 'ONLINE') tipoFormatado = 'Online'
  if (data.meetingType === 'HIBRIDA') tipoFormatado = 'Híbrida'
  
  parts.push(`*Formato:* ${tipoFormatado}`)

  if (data.platform) {
    parts.push(`*Plataforma:* ${data.platform}`)
  }
  if (data.meetingUrl) {
    parts.push(`*Link:* ${data.meetingUrl}`)
  }

  if (data.location || data.address) {
    parts.push(`*Local:* ${data.location || 'Não especificado'}`)
    if (data.address) {
      let fullAddress = data.address
      if (data.complement) fullAddress += ` - ${data.complement}`
      if (data.room) fullAddress += ` - Sala: ${data.room}`
      parts.push(`*Endereço:* ${fullAddress}`)
    }
  }

  // Participantes
  if (data.participants && data.participants.length > 0) {
    parts.push('')
    parts.push('*Participantes:*')
    data.participants.forEach(p => {
      parts.push(`• ${p}`)
    })
  }

  // Pauta
  if (data.agendaItems && data.agendaItems.length > 0) {
    parts.push('')
    parts.push('*Pauta:*')
    data.agendaItems.forEach(item => {
      parts.push(`• ${item}`)
    })
  }

  // Observações (if it should be shared, normally we might omit internal notes, but let's include if passed)
  if (data.notes) {
    parts.push('')
    parts.push('*Observações:*')
    parts.push(data.notes)
  }

  return parts.join('\n')
}

export function createWhatsAppShareUrl(message: string, phone?: string): string {
  const encodedMessage = encodeURIComponent(message)
  
  if (phone) {
    // Clean phone number (remove non-digits)
    const cleanPhone = phone.replace(/\D/g, '')
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
  }
  
  // Use api.whatsapp.com/send if no phone is provided, or wa.me/?text=
  return `https://wa.me/?text=${encodedMessage}`
}
