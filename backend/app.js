const express = require('express')
const app = express();
const cors = require('cors');
const ArtifactRoutes = require('./router/ArtifactRoutes')
const UserRoutes = require('./router/UserRoutes');
const CommunityRoutes = require('./router/CommunityRoutes');
const FeedbackRoutes = require('./router/FeedbackRoutes');
const NewsletterRoutes = require('./router/NewsletterRoutes');
const ImageRoutes = require('./router/ImageRoutes');

const allowedOrigins = ['https://artcornerjs.vercel.app', 'http://localhost:5000'];

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback('Not allowed by CORS');
    }
  },
  credentials: true,
}));

app.use('/api/artifacts', ArtifactRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/community', CommunityRoutes);
app.use('/api/feedback', FeedbackRoutes);
app.use('/api/newsletter', NewsletterRoutes);
app.use('/api/image', ImageRoutes);

module.exports = app;