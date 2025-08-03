const express = require('express')
const app = express();
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const ArtifactRoutes = require('./router/ArtifactRoutes')
const UserRoutes = require('./router/UserRoutes');
const CommunityRoutes = require('./router/CommunityRoutes');
const FeedbackRoutes = require('./router/FeedbackRoutes');
const NewsletterRoutes = require('./router/NewsletterRoutes');

dotenv.config();

const PORT = 5000;
const uri = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/api/artifacts', ArtifactRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/community', CommunityRoutes);
app.use('/api/feedback', FeedbackRoutes);
app.use('/api/newsletter', NewsletterRoutes);

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("DB Connected Successfully")
    })
    .catch((err) => {
        console.error("DB Connection Failed", err)
    })

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})