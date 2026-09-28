import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const INITIAL_CATEGORIES = [
  { name: 'Trabalho', color: '#3b82f6' },
  { name: 'Cliente', color: '#10b981' },
  { name: 'Comercial', color: '#f59e0b' },
  { name: 'Financeiro', color: '#8b5cf6' },
  { name: 'Projeto', color: '#ec4899' },
  { name: 'Equipe', color: '#06b6d4' },
  { name: 'Parceiro', color: '#14b8a6' },
  { name: 'Fornecedor', color: '#6366f1' },
  { name: 'Igreja', color: '#eab308' },
  { name: 'Pessoal', color: '#f97316' },
  { name: 'Outro', color: '#6b7280' },
]

async function main() {
  console.log('Seeding initial categories...')

  let defaultCategoryId: string | null = null

  for (const cat of INITIAL_CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: {
        name: cat.name,
        color: cat.color,
        active: true,
      },
    })
    if (cat.name === 'Trabalho') {
      defaultCategoryId = created.id
    }
  }

  // Initial user settings
  await prisma.userSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      userProfileName: 'Luiz',
      userWhatsapp: '',
      userEmail: '',
      userCompany: '',
      firstDayOfWeek: 0,
      defaultStartTime: '09:00',
      defaultDurationMinutes: 60,
      defaultCategoryId: defaultCategoryId,
      theme: 'system',
    },
  })

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
