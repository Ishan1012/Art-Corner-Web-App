import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoutes';
import artifactRoutes from './routes/artifactRoutes';
import communityRoutes from './routes/communityRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import imageRoutes from './routes/imageRoutes';
import newsletterRoutes from './routes/newsletterRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';

const app = express();

// Body Parser and CORS Configuration
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Mount all TypeScript MVC routers under /api/*
app.use('/api/users', userRoutes);
app.use('/api/user', userRoutes);
app.use('/api/artifacts', artifactRoutes);
app.use('/api/artifact', artifactRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/newsletters', newsletterRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/comment', commentRoutes);

// HTTP 404 Fallback Middleware
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Central Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Express Central Error Handler:', err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

export default app;
export { app };
