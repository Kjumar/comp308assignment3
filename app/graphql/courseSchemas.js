var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var CourseModel = require('../models/course.server.model');

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

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
      return {
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
        }
      }
    }
});

  //Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function(){
        return{
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
                    courseName: params.courseName, section: section.email, semester: params.semester
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
            }
        }
    }
})



module.exports = new GraphQLSchema({query: queryType, mutation: mutation});