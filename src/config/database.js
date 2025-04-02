const mongoose = require('mongoose');


const connectDB = async () => {
    await mongoose.connect('mongodb+srv://NodeJs:nodejspassword@cluster0.l8cm7.mongodb.net/devTinder');
}; 

module.exports = connectDB ;
