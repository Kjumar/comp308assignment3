var config = require('./config'),
    mongoose = require('mongoose');
// Define the Mongoose configuration method
module.exports = function () {
    // Use Mongoose to connect to MongoDB
    const db = mongoose.connect(config.db, {
		useUnifiedTopology: true,
		useNewUrlParser: true, useCreateIndex: true,
    useFindAndModify: false 
		}).then(() => console.log('DB Connected!'))
		.catch(err => {
		console.log('Error: failed to connect to database');
		});

    // NOTE: useCreateIndex is not supported in newer version of mongoose. We're using v5.10.14 for this

    // Load the 'User' model 
    require('../app/models/student.server.model');
    // Load the 'Course' model 
    require('../app/models/course.server.model');
    // Return the Mongoose connection instance
    return db;
};