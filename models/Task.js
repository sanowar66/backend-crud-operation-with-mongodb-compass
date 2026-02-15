const mongoose = require('mongoose')
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 75
    },
    desc: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    status: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20

    }
}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)