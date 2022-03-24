var Student = require('../../models/student.server.model');
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { private_key } from '../../helpers/keys.js';

export default {
    student:({studentId},req) => {
        if (!req.isAuth) {
            throw new Error("Unauthorized");
        }
        const studentInfo =  Student.findById(studentId).exec();
        if (!studentInfo) {
            throw new Error('Error');
        }
       
       return studentInfo;
    },
    createUser: async (args) => {
        const newStudent = new Student(args.studentInput);
        const student = await newStudent.save();
        return student;
    },
    login: async ({ studentNumber, password }) => {
        console.log(studentNumber);
        try {
            const student = await Student.findOne({ studentNumber });
            if (!student) {
                throw new Error('Invalid Credentials!user')
            }
            const isCorrectPassword = await bcrypt.compare(password, student.password);
            if (!isCorrectPassword) {
                throw new Error("Invalid Credentials!password")
            }
            const token = jwt.sign({ _id: student._id, studentNumber: student.studentNumber }, private_key, {
                algorithm: "RS256"
            });
            return {
                token,
                studentId: student._id
            }
        } catch (error) {
            return error
        }
    },
    posts: (_, req) => {
        if (!req.isAuth) {
            throw new Error("Unauthorized");
        }
        return [{ title: "accident", description: "accident ocurred" }, { title: "Laptop", description: "Buy A new Laptop" }]
    }
}