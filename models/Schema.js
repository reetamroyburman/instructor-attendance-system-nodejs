const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    name: {
        type: String,
        required: true
    },
    

}, {
    timestamps: true
});


const checkInOutSchema = new mongoose.Schema({
    instructorId: {
        type:String,
        required: true,
        unique: true,
    },
    checkInOuts: [{
        checkInTime: {
            type:Date,
            required: true
        },
        checkOutTime: {
            type:Date,
        },
    }],
    workingHrs:{
        type:String,
    }
});

const instructor = mongoose.model('user', instructorSchema);
const checkInOut = mongoose.model('checkInOutSchema', checkInOutSchema);

module.exports = {instructor, checkInOut}