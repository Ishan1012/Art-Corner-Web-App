const mongoose = require('mongoose')

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/artcorner';

const connectDB = () => {
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log("DB Connected Successfully")
        })
        .catch((err) => {
            console.error("DB Connection Failed", err)
        });
}

module.exports = connectDB;