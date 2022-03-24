process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// mongoose
var mongoose = require('./config/mongoose'),
    express = require('./config/express');

const { graphqlHTTP } = require('express-graphql');
var studentSchema = require('./app/graphql/studentSchemas');
var courseSchema = require('./app/graphql/courseSchemas');
var cors = require('cors');
const { verifyToken } = require('./app/helpers/jwt.js');

var db = mongoose();
var app = express();

//configure GraphQL to use over HTTP
app.use('*', cors());
app.use(verifyToken);
app.use('/graphql', cors(), graphqlHTTP({
    schema: studentSchema,
    rootValue: global,
    graphiql: true,
}));
app.use('/graphql/courses', cors(), graphqlHTTP({
    schema: courseSchema,
    rootValue: global,
    graphiql: true,
}));

app.listen(4000, () => console.log('Express GraphQl Server running at http://localhost:4000/'));

module.exports = app;

