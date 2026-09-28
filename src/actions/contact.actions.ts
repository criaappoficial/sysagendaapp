'use server'

import { prisma } from '@/lib/prisma'
import { participantSchema, type ParticipantFormData } from '@/schemas/participant.schema'
import { companySchema, type CompanyFormData } from '@/schemas/company.schema'
import { revalidatePath } from 'next/cache'

// Participants (Contacts)

export async function createParticipant(data: ParticipantFormData) {
  const validated = participantSchema.parse(data)
  const participant = await prisma.participant.create({
    data: {
      name: validated.name,
      whatsapp: validated.whatsapp,
      email: validated.email,
      companyId: validated.companyId,
      role: validated.role,
      notes: validated.notes,
    }
  })
  revalidatePath('/contacts')
  return participant
}

export async function getParticipants() {
  return await prisma.participant.findMany({
    include: { company: true },
    orderBy: { name: 'asc' }
  })
}

export async function deleteParticipant(id: string) {
  await prisma.participant.delete({ where: { id } })
  revalidatePath('/contacts')
}

// Companies

export async function createCompany(data: CompanyFormData) {
  const validated = companySchema.parse(data)
  const company = await prisma.company.create({
    data: {
      name: validated.name,
      cnpj: validated.cnpj,
      website: validated.website,
      phone: validated.phone,
      email: validated.email,
      notes: validated.notes,
    }
  })
  revalidatePath('/companies')
  return company
}

export async function getCompanies() {
  return await prisma.company.findMany({
    orderBy: { name: 'asc' }
  })
}

export async function deleteCompany(id: string) {
  await prisma.company.delete({ where: { id } })
  revalidatePath('/companies')
}
