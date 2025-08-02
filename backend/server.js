const express = require('express')
const app = express();
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const ArtifactRoutes = require('./router/ArtifactRoutes')

dotenv.config();

const PORT = 5000;
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/artcorner';

app.use(express.json());
app.use(cors());

app.use('/api/artifacts', ArtifactRoutes);
// app.use('/api/users', UserRoutes);

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