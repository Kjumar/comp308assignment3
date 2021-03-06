const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Student = require('../models/student.server.model.js');

const { private_key, public_key } = require('./keys.js');

dotenv.config();

const verifyToken = async (req, res, next) => {

    const authToken = req.get('authorization');
    if (!authToken) {
        req.isAuth = false;
        return next()
    }
    const token = authToken.split(' ')[1];
    let verify;
    try {
        verify = jwt.verify(token, public_key, { algorithm: "RS256" })
    } catch (error) {
        req.isAuth = false;
        return next()
    }
    if (!verify._id) {
        req.isAuth = false;
        return next()
    }
    const student = await Student.findById(verify._id);
    if (!student) {
        req.isAuth = false;
        return next()
    }
    req.studentId = student._id;
    req.isAuth = true;
    next()
}

module.exports = { verifyToken };