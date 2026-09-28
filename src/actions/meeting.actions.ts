'use server'

import { prisma } from '@/lib/prisma'
import { meetingSchema, type MeetingFormData } from '@/schemas/meeting.schema'
import { calculateDurationMinutes } from '@/lib/date'
import { revalidatePath } from 'next/cache'

export async function createMeeting(data: MeetingFormData) {
  // Validate data
  const parsed = meetingSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }
  const validated = parsed.data
  
  const durationMinutes = calculateDurationMinutes(validated.startTime, validated.endTime)

  // Create meeting
  const meeting = await prisma.meeting.create({
    data: {
      title: validated.title,
      description: validated.description,
      categoryId: validated.categoryId,
      date: validated.date,
      startTime: validated.startTime,
      endTime: validated.endTime,
      durationMinutes,
      meetingType: validated.meetingType,
      platform: validated.platform,
      meetingUrl: validated.meetingUrl,
      location: validated.location,
      address: validated.address,
      room: validated.room,
      complement: validated.complement,
      notes: validated.notes,
      reminderMinutes: validated.reminderMinutes,
      recurrence: validated.recurrence,
      status: 'AGENDADA',
      
      // Participants
      participants: {
        create: validated.participantIds.map(participantId => ({
          participant: { connect: { id: participantId } }
        }))
      },
      
      // Agenda Items
      agendaItems: {
        create: validated.agendaItems.map((text, index) => ({
          text,
          itemOrder: index
        }))
      },
      
      // Initial History
      history: {
        create: [{
          action: 'CRIADA'
        }]
      }
    }
  })
  
  revalidatePath('/')
  revalidatePath('/meetings')
  return meeting
}

export async function getMeetings(filters?: {
  date?: string
  categoryId?: string
  status?: string
  limit?: number
}) {
  const where: any = {}
  
  if (filters?.date) {
    where.date = filters.date
  }
  if (filters?.categoryId) {
    where.categoryId = filters.categoryId
  }
  if (filters?.status) {
    where.status = filters.status
  }
  
  const meetings = await prisma.meeting.findMany({
    where,
    include: {
      category: true,
      participants: {
        include: { participant: true }
      },
    },
    orderBy: [
      { date: 'asc' },
      { startTime: 'asc' }
    ],
    take: filters?.limit
  })
  
  return meetings
}

export async function getMeetingById(id: string) {
  return await prisma.meeting.findUnique({
    where: { id },
    include: {
      category: true,
      agendaItems: {
        orderBy: { itemOrder: 'asc' }
      },
      participants: {
        include: {
          participant: {
            include: { company: true }
          }
        }
      },
      history: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })
}

export async function updateMeetingStatus(id: string, status: string) {
  const meeting = await prisma.meeting.update({
    where: { id },
    data: { 
      status,
      history: {
        create: [{ action: 'STATUS_ALTERADO' }]
      }
    }
  })
  
  revalidatePath('/')
  revalidatePath('/meetings')
  revalidatePath(`/meetings/${id}`)
  return meeting
}

export async function deleteMeeting(id: string) {
  await prisma.meeting.delete({
    where: { id }
  })
  revalidatePath('/')
  revalidatePath('/meetings')
}

export async function updateMeeting(id: string, data: MeetingFormData) {
  const parsed = meetingSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }
  const validated = parsed.data
  
  const durationMinutes = calculateDurationMinutes(validated.startTime, validated.endTime)

  const meeting = await prisma.meeting.update({
    where: { id },
    data: {
      title: validated.title,
      description: validated.description,
      categoryId: validated.categoryId,
      date: validated.date,
      startTime: validated.startTime,
      endTime: validated.endTime,
      durationMinutes,
      meetingType: validated.meetingType,
      platform: validated.platform,
      meetingUrl: validated.meetingUrl,
      location: validated.location,
      address: validated.address,
      room: validated.room,
      complement: validated.complement,
      notes: validated.notes,
      reminderMinutes: validated.reminderMinutes,
      recurrence: validated.recurrence,
      
      participants: {
        deleteMany: {},
        create: validated.participantIds.map(participantId => ({
          participant: { connect: { id: participantId } }
        }))
      },
      
      agendaItems: {
        deleteMany: {},
        create: validated.agendaItems.map((text, index) => ({
          text,
          itemOrder: index
        }))
      },
      
      history: {
        create: [{ action: 'ATUALIZADA' }]
      }
    }
  })
  
  revalidatePath('/')
  revalidatePath('/meetings')
  revalidatePath(`/meetings/${id}`)
  return meeting
}
