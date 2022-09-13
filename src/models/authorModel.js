//=====================Importing Module and Packages=====================//
const mongoose = require('mongoose')


//=====================Email validation====================//
var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

//=====================Creating Author Schema=====================//
const authorSchema = new mongoose.Schema({
    fname: { type: String, required: true, trim: true },
    lname: { type: String, required: true, trim: true },
    title: { type: String, required: true, enum: ["Mr", "Mrs", "Miss"] },
    email: {
        type: String, required: true, trim: true, lowercase: true, unique: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: { type: String, required: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('authorDataBase', authorSchema)