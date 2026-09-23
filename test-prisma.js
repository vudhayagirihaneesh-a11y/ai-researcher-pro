const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.woaalsoozbxivjoxyffw:%40vudhayahaneesh01@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
    }
  }
});
prisma.researchSession.findFirst().then(console.log).catch(console.error).finally(() => prisma.$disconnect());
