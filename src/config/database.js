const mongoose = require('mongoose');


const connectDB = async () => {
    console.log(process.env.DB_CONNECTION_SECRET);
    // await mongoose.connect('mongodb+srv://NodeJs:nodejspassword@cluster0.l8cm7.mongodb.net/devTinder');
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);
}; 

module.exports = connectDB ;
