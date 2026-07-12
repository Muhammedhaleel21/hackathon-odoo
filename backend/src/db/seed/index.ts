import 'dotenv/config';
import { seedAdmin, closeSeedConnection } from './admin.seed';

async function main() {
  await seedAdmin();

  console.log('✅ Database seeding completed');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await closeSeedConnection();
  });
