import app from './app';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const PORT = process.env.PORT || 5000;
export const prisma = new PrismaClient();

const startServer = async () => {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log('📦 Database connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed', error);
    process.exit(1);
  }
};

startServer();
