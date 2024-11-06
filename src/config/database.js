const mongoose = require('mongoose');

const connectDB = async()=>{
    await mongoose.connect("mongodb+srv://namastedev:rV8W8pLOhLhU0Vad@namastenode.d5a4x.mongodb.net/")
};



module.exports = connectDB;

