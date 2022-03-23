const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const Student = mongoose.model('Student');

const getErrorMessage = function(err) {
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].
                message;
        }
    } else {
        return 'Unknown server error';
    }
};

// =================================
//      Courses CRUD operations
// =================================

exports.create = function(req, res) {
    const course = new Course();
    course.courseName = req.body.courseName;
    course.courseCode = req.body.courseCode;
    course.section = req.body.section;
    course.semester = req.body.semester;
    console.log(req.body);

    course.save((err) => {
        if (err) {
            console.log('error', getErrorMessage(err));
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(course);
        }
    });
};

exports.list = function(req, res) {
    Course.find().sort({courseCode: 'asc', semester: 'asc', section: 'asc'}).exec((err, courses) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(courses);
        }
    });
};

exports.courseById = function(req, res, next, id) {
    Course.findById(id).exec((err, course) => {
        if (err) {
            return next(err);
        }
        if (!course) {
            return next (new Error('Failed to find course id: ' + id));
        }
        req.course = course;
        next();
    });
};

// echos the course back as a json response
exports.read = function(req, res) {
    res.status(200).json(req.course);
};

exports.listSections = function(req, res) {
    Course.findAll({courseCode: req.courseCode}).exec((err, courses) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(courses);
        }
    });
}

exports.update = function(req, res) {
    const course = req.course;

    Course.findByIdAndUpdate(course._id, req.body, function (err, course) {
        if (err) {
          console.log(err);
          return next(err);
        }
        res.json(course);
    });
};

exports.delete = function (req, res) {
    const course = req.course;
    course.remove((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(course);
        }
    });
};

// =================================================================
//      advanced operations using the Student.courses property
// =================================================================

// adds a course to the given student's 'courses' list
exports.addCourse = function(req, res) {
    const course = req.body.course;
    const student = req.body.student;

    Student.findOne({studentNumber: student.studentNumber}).exec((err, student) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        // ==========================================================================================
        // USING SAVE WILL REHASH THE PASSWORD... USE UPDATE INSTEAD TO ONLY CHANGE THE COURSES FIELD
        // ==========================================================================================
        Student.findOneAndUpdate({_id: student._id},
            {courses: [...student.courses, course._id]}, (err, student) => {
                if (err) {
                    return res.status(400).send({
                        message: getErrorMessage(err)
                    });
                } else {
                    res.status(200).json(student);
                }
        });
    });
};

// list courses added to the student's courses list
exports.listAddedCourses = function(req, res) {
    const studentNumber = req.body.studentNumber;

    Student.findOne({studentNumber: studentNumber}).populate('courses').exec((err, courses) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(courses.courses);
        }
    });
}

// list students that are enrolled in a given course
exports.listStudentsInCourse = function(req, res) {
    const course = req.course;

    Student.find({ courses: course._id }).exec((err, students) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(students);
        }
    });
}

// removes a course from the student's courses list
exports.removeCourse = function(req, res) {
    const courseId = req.body.courseId;
    const studentNumber = req.body.studentNumber;

    Student.findOne({studentNumber: studentNumber}).populate('courses').exec((err, student) => {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        const newCourses = student.courses.filter( (course) => course._id != courseId);
        /* NOTE: since we're populating before filtering, this has the added effect of removing
            courses that no longer exist from the courses list. Free housekeeping! */

        Student.findOneAndUpdate({studentNumber: studentNumber},
            {courses: newCourses}, (err, student) => {
                if (err) {
                    return res.status(400).send({
                        message: getErrorMessage(err)
                    });
                } else {
                    res.status(200).json(student);
                }
        });
    });
}