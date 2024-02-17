const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required: true,
        unique: true
    },
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
        ref:'user'
    },
    checkInTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    checkOutTime: {
        type:Date,
        default: null
    }
});

const instructorModel = mongoose.model('user', instructorSchema);
const checkInOut = mongoose.model('checkInOutSchema', checkInOutSchema);

module.exports = {
    instructorModel, 
    checkInOut
}