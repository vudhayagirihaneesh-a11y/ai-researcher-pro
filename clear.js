const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.researchSession.deleteMany({}).then(() => console.log('Deleted all sessions')).catch(console.error).finally(() => prisma.$disconnect());
