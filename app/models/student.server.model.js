const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Schema = mongoose.Schema;

// some of these fields need proper types/validation (like the password field)
var StudentSchema = new Schema({
    studentNumber: {
        type: Number,
        unique: true,
        required: 'Student number is required'
    },
    firstName: {
        type: String,
        validate: [
            (name) => name && name.length >= 1,
            'First name is required'
        ],
        trim: true
    },
    lastName: {
        type: String,
        validate: [
            (name) => name && name.length >= 1,
            'Last name is required'
        ],
        trim: true
    },
    address: String,
    city: String,
    phoneNumber: {
        type: Number,
        validate:[
            (phoneNumber) => phoneNumber && (phoneNumber.toString()).length >= 10,
            'There must be 10 digits in Phone number'
        ]
    },
    email: {
        type: String,
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        validate: [
            (password) => password && password.length >= 6,
            'Password must contain at least 6 characters'
        ]
    },
    // reference to courses
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

// Set the 'fullname' virtual property
StudentSchema.virtual('fullName').get(function() {
	return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
	const splitName = fullName.split(' ');
	this.firstName = splitName[0] || '';
	this.lastName = splitName[1] || '';
});

// Use a pre-save middleware to hash the password
// before saving it into database
StudentSchema.pre('save', function(next){
	//hash the password before saving it
	this.password = bcrypt.hashSync(this.password, saltRounds);
	next();
});

// Create an instance method for authenticating user
StudentSchema.methods.authenticate = function(password) {
	//compare the hashed password of the database 
	//with the hashed version of the password the user enters
	return this.password === bcrypt.hashSync(password, saltRounds);
};

// Configure the 'StudentSchema' to use getters and virtuals when transforming to JSON
StudentSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

module.exports = mongoose.model('Student', StudentSchema);