import axios from 'axios';
import {Spinner, Jumbotron, Form, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';
import React, { useState } from 'react';
import Login from './Login';

import { useAuthToken, useAuthUserToken } from "../config/auth";
import {gql, useQuery, useMutation} from "@apollo/client";

const CREATE_COURSE = gql`
  mutation addCourse($courseCode: String!, $courseName: String!, $section: Int!, $semester: String!){
    addCourse(courseCode: $courseCode, courseName: $courseName, section: $section, semester: $semester){
      courseCode
      courseName
      section
      semester
    }
  }
`;

//
function CreateCourse(props) {
    //
    const firstName = props.screen;
    const [course, setcourse] = useState({ _id: '', courseCode: '', courseName: '', section: 0 , semester: '', firstName: '' });
    const [showLoading, setShowLoading] = useState(false);

    const [authToken] = useAuthToken()
    const [authUserToken] = useAuthUserToken()

    const [onHandleCreate] = useMutation(CREATE_COURSE);
    //
    const onChange = (e) => {
        e.persist();
        setcourse({...course, [e.target.name]: e.target.value});
      }
    
    if (!authToken)
    {
      return (
        <div>
          <Login />
        </div>
      )
    }
    
    return (
        <div>
          <Jumbotron>
            <h2> Create a course {firstName} </h2>
            {showLoading && 
                <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
                </Spinner> 
            } 
            <Form>
              <Form.Group>
                <Form.Label> Course Code</Form.Label>
                <Form.Control type="text" name="courseCode" id="courseCode" placeholder="abcd123" value={course.courseCode} onChange={onChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label> Course Name</Form.Label>
                <Form.Control type="text" name="courseName" id="courseName" placeholder="enter course name" value={course.courseName} onChange={onChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label> Section</Form.Label>
                <Form.Control type="text" name="section" id="section" placeholder="001" value={course.section} onChange={onChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label> Semester</Form.Label>
                <Form.Control type="text" name="semester" id="semester" placeholder="W22" value={course.semester} onChange={onChange} />
              </Form.Group>
            </Form>
            <Button variant="primary" onClick={() => {
              setShowLoading(true);
              onHandleCreate({
                variables: {
                  courseCode: course.courseCode,
                  courseName: course.courseName,
                  section: parseInt(course.section),
                  semester: course.semester
                }
              }).then(() => {
                setShowLoading(false);
                props.history.push('/courses');
                window.location.reload();
              }).catch((err) => {
                console.log(err);
              });
            }}>
                Save course
              </Button>
          </Jumbotron>
        </div>
    );


}

export default withRouter(CreateCourse);
