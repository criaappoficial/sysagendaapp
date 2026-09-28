'use server'

import { prisma } from '@/lib/prisma'
import { settingsSchema, type SettingsFormData } from '@/schemas/settings.schema'
import { revalidatePath } from 'next/cache'

export async function getSettings() {
  const settings = await prisma.userSettings.findUnique({
    where: { id: 'default' }
  })
  if (!settings) {
    // Should have been seeded, but fallback just in case
    return await prisma.userSettings.create({
      data: { id: 'default' }
    })
  }
  return settings
}

export async function updateSettings(data: SettingsFormData) {
  const validated = settingsSchema.parse(data)
  const settings = await prisma.userSettings.update({
    where: { id: 'default' },
    data: {
      userProfileName: validated.userProfileName,
      userWhatsapp: validated.userWhatsapp || '',
      userEmail: validated.userEmail || '',
      userCompany: validated.userCompany || '',
      firstDayOfWeek: validated.firstDayOfWeek,
      defaultStartTime: validated.defaultStartTime,
      defaultDurationMinutes: validated.defaultDurationMinutes,
      defaultCategoryId: validated.defaultCategoryId,
      theme: validated.theme,
    }
  })
  revalidatePath('/')
  return settings
}
