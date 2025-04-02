const mongoose = require('mongoose');


const connectDB = async () => {
    await mongoose.connect('mongodb+srv://NodeJs:ZPvhttT18MPMlnQM@cluster0.l8cm7.mongodb.net/');
}; 

connectDB().then(() => {
    console.log("Database succesfully established");
}).catch(() => {
    console.log("Database not established succesfully");
});