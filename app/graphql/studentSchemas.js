const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

var private_key = require('../helpers/keys.js').private_key;

var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var StudentModel = require('../models/student.server.model');
var CourseModel = require('../models/course.server.model');


//Model
const studentType = new GraphQLObjectType({
    name: 'student',
    fields: function () {
        return {
            id : {
                name: '_id',
                type: GraphQLString
            },
            studentNumber: {
                type: GraphQLInt
            },
            firstName: {
                type: GraphQLString
            },
            lastName: {
                type: GraphQLString
            },
            address: {
                type: GraphQLString
            },
            city: {
                type: GraphQLString
            },
            phoneNumber: {
                type: GraphQLString
            },
            email: {
                type: GraphQLString
            },
            password: {
                type: GraphQLString
            },
            courses: {
                type: GraphQLList(GraphQLString)
            }
        }
    }
})

const courseType = new GraphQLObjectType({
    name: "Course",
    fields: function () {
        return {
            id : {
                name: '_id',
                type: GraphQLString
            },
            courseCode:{
                type: GraphQLString
            },
            courseName:{
                type: GraphQLString
            },
            section:{
                type: GraphQLInt
            },
            semester:{
                type: GraphQLString
            },
        }
    }
})

const LoginReturnType = new GraphQLObjectType({
    name: 'loginType',
    fields: function() {
        return {
            token: {
                type: GraphQLString
            },
            studentId: {
                type: GraphQLID
            }
        }
    }
})

//Queries
const queryType = new GraphQLObjectType({
    name: "StudentQuery",
    fields: function () {
        return {
            students: {
                type: new GraphQLList(studentType),
                resolve: function () {
                    const students = StudentModel.find().exec();
                    if (!students) {
                        throw new Error('Error');
                    }
                    return students;
                }
            },
            student: {
                type: studentType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: async function (root, params) {
                    const studentInfo = await StudentModel.findById(params.id).exec();
                    if(!studentInfo){
                        throw new Error('Error');
                    }
                    return studentInfo;
                }
            },
            courses: {
                type: new GraphQLList(courseType),
                resolve: function () {
                    const courses = CourseModel.find().exec()
                    if (!courses) {
                        throw new Error('Error')
                    }
                    return courses
                }
            },
            course: {
                type: courseType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const courseInfo = CourseModel.findById(params.id).exec()
                    if (!courseInfo) {
                    throw new Error('Error')
                    }
                    return courseInfo
                }
            },
            enrolledCourses: {
                type: new GraphQLList(courseType),
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: async function (root, params) {
                    const student = await StudentModel.findById(params.id).populate('courses').exec();
                    if (!student)
                    {
                        throw new Error('Error');
                    }
                    console.log(student);
                    return student.courses;
                }
            },
            enrolledStudents: {
                type: new GraphQLList(studentType),
                args: {
                    courseId: {
                        type: GraphQLString
                    }
                },
                resolve: async function (root, params) {
                    const students = await StudentModel.find({ courses: params.courseId }).exec();
                    if (!students)
                    {
                        throw new Error('Error');
                    }
                    return students;
                }
            }
        }
    }
})

//Mutations
const mutation = new GraphQLObjectType({
    name: 'StudentMutation',
    fields: function(){
        return{
            addStudent: {
                type: studentType,
                args: {
                    studentNumber: {
                        type: GraphQLInt
                    },
                    firstName: {
                        type: GraphQLString
                    },
                    lastName: {
                        type: GraphQLString
                    },
                    address: {
                        type: GraphQLString
                    },
                    city: {
                        type: GraphQLString
                    },
                    phoneNumber: {
                        type: GraphQLString
                    },
                    email: {
                        type: GraphQLString
                    },
                    password: {
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const studentModel = new StudentModel(params);
                    const newStudent = studentModel.save(function (err) {
                        if (err)
                        {
                            console.log(err);
                        }
                    });
                    if (!newStudent){
                        throw new Error('Error');
                    }
                    return newStudent;
                }
            },
            updateStudent: {
                type: studentType,
                args: {
                    id: {
                        name: '_id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    firstName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    lastName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    address: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    city: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    phoneNumber: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    email: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function (root, params) {
                    const updatedStudent = StudentModel.findByIdAndUpdate(
                        params.id,
                        {
                            firstName: params.firstName,
                            lastName: params.lastName,
                            address: params.address,
                            city: params.city,
                            phoneNumber: params.phoneNumber,
                            email: params.email
                        },
                        function (err) {
                            if (err) return next(err);
                        }
                    );
                    return updatedStudent;
                }
            },
            deleteStudent: {
                type: studentType,
                args: {
                    id: {
                        name: '_id',
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function (root, params) {
                    const deletedStudent = StudentModel.findByIdAndRemove(params.id).exec();
                    if (!deletedStudent) {
                        throw new Error('Error');
                    }
                    return deletedStudent;
                }
            },
            login:{
                type: LoginReturnType,
                args: {
                    studentNumber: {
                        type: GraphQLString
                    },
                    password: {
                        type: GraphQLString
                    }
                },
                resolve: async function (root, params) {
                    try {
                        const student = await StudentModel.findOne({ studentNumber: params.studentNumber});
                        if (!student) {
                            throw new Error('Invalid Credentials');
                        }
                        const isCorrectPassword = await bcrypt.compare(params.password, student.password);
                        if (!isCorrectPassword) {
                            throw new Error("Invalid Credentials!password")
                        }
                        console.log('login from ' + student.studentNumber);
                        const token = jwt.sign({ _id: student._id, studentNumber: student.studentNumber }, private_key, {
                            algorithm: "RS256"
                        });
                        return {
                            token,
                            studentId: student._id
                        };
                    } catch (error) {
                        return error;
                    }
                }
            },
            addCourse: {
                type: courseType,
                args: {
                    courseCode: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    courseName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    section: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    semester: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: function (root, params) {
                    const courseModel = new CourseModel(params);
                    const newCourse = courseModel.save();
                    if (!newCourse) {
                      throw new Error('Error');
                    }
                    return newCourse
                }
            },
            updateCourse: {
                type: courseType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    courseCode: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    courseName: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    section: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    semester: {
                        type: new GraphQLNonNull(GraphQLString)
                    }         
                },
                resolve(root, params) {
                    return CourseModel.findByIdAndUpdate(params.id, { courseCode: params.courseCode, 
                        courseName: params.courseName, section: params.section, semester: params.semester
                        }, function (err) {
                        if (err) return next(err);
                    });
                }
            },
            deleteCourse: {
                type: courseType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    const deletedCourse = CourseModel.findByIdAndRemove(params.id).exec();
                    if (!deletedCourse) {
                        throw new Error('Error')
                    }
                    return deletedCourse;
                }
            },
            enrollStudent: {
                type: studentType,
                args: {
                    studentId: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    courseId: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: async function (root, params) {
                    const student = await StudentModel.findById(params.studentId).exec();
                    if (!student) {
                        throw new Error('Error');
                    }
                    else
                    {
                        const course = await CourseModel.findById(params.courseId).exec();
                        if (!course)
                        {
                            throw new Error('Error');
                        }
                        else
                        {
                            const updatedStudent = await StudentModel.findByIdAndUpdate(student._id, {
                                courses: [...student.courses, course._id]
                            }).exec();
                            if (!updatedStudent) {
                                throw new Error('Error');
                            }
                            return updatedStudent;
                        }
                    }
                }
            },
            unenrollStudent: {
                type: studentType,
                args: {
                    studentId: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    courseId: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve: async function (root, params) {
                    const student = await StudentModel.findById(params.studentId).populate('courses').exec();
                    if (!student)
                    {
                        throw new Error('Error');
                    }
                    else
                    {
                        const courses = student.courses.filter((course) => course._id != params.courseId);
                        const updatedStudent = await StudentModel.findByIdAndUpdate(params.studentId, 
                            {courses: courses}).exec();
                        if (!updatedStudent)
                        {
                            throw new Error('Error');
                        }
                        return updatedStudent;
                    }
                }
            }
        }
    }
})

module.exports = new GraphQLSchema({query: queryType, mutation: mutation});