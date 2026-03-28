import 'dotenv/config';
import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
    // @ts-ignore - Prisma 7 CLI direct connection override (User request)
    directUrl: process.env.DIRECT_URL,
  },
});
