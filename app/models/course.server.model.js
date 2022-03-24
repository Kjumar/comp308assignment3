const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var CourseSchema = new Schema({
    courseCode: {
        type: String,
        required: "Course code is required"
    },
    courseName: {
        type: String,
        required: "Course name is required"
    },
    section: {
        type: Number,
        required: "Section is required"
    },
    semester: {
        type: String,
        required: "Semester is required"
    }
});

module.exports = mongoose.model('Course', CourseSchema);