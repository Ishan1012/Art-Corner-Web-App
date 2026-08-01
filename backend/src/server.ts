import app from './app';
import { connectDB } from './config/db';
import { seedAdmin } from './config/seedAdmin';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

export const startServer = async () => {
  try {
    const conn = await connectDB();
    await seedAdmin();
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    return { server, conn };
  } catch (err) {
    console.error('Failed to start server:', err);
    throw err;
  }
};

if (process.env.NODE_ENV !== 'test' && require.main === module) {
  startServer();
}

export default app;
export { app };

