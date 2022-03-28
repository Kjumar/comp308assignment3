import React, { useState, useEffect } from 'react';
import {Spinner, Jumbotron, Form, Button} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Login from './Login';

import { useAuthToken, useAuthUserToken } from "../config/auth";
import {gql, useQuery, useMutation} from "@apollo/client";

const GET_COURSE = gql`
  query course($courseId: String!) {
    course(id: $courseId) {
      id
      courseCode
      courseName
      section
      semester
    }
  }
`;

const UPDATE_COURSE = gql`
  mutation updateCourse($courseId: String!, $courseCode: String!, $courseName: String!, $section: Int!, $semester: String!){
    updateCourse(id: $courseId, courseCode: $courseCode, courseName: $courseName, section: $section, semester: $semester){
      courseCode
      courseName
      section
      semester
    }
  }
`;


function EditCourse(props) {
    const [showLoading, setShowLoading] = useState(false);
    const apiUrl = "http://localhost:3000/api/courses/" + props.match.params.id;
    const courseId = props.match.params.id;

    const [authToken] = useAuthToken()
    const [authUserToken] = useAuthUserToken()

    const { loading, error, data } = useQuery(GET_COURSE, {
      variables: { courseId: courseId }
    });
    const [course, setCourse] = useState(data.course);

    const [onHandleUpdate] = useMutation(UPDATE_COURSE);

    //runs when course field is changed
    const onChange = (e) => {
      e.persist();
      setCourse({...course, [e.target.name]: e.target.value});
    }

    if (!authToken)
    {
      return (
        <div>
          <Login />
        </div>
      )
    }

    if (loading)
    {
      return (
        <div>
          <Jumbotron>
            {showLoading && <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner> }
          </Jumbotron>
        </div>
      );
    }

    // TODO: make a nicer error page
    if (error)
    {
      return <p>Error...</p>;
    }

    return (
      <div>
        {showLoading && 
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner> 
        } 
        <Jumbotron>
          <Form>
          <Form.Group>
            <Form.Label> Course Code</Form.Label>
            <Form.Control type="text" name="courseCode" id="courseCode" placeholder="Enter Course Name" value={course.courseCode} onChange={onChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label> Course Name</Form.Label>
            <Form.Control type="text" name="courseName" id="courseName" placeholder="Enter Course Code" value={course.courseName} onChange={onChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Section</Form.Label>
            <Form.Control type="text" name="section" id="section" rows="3" placeholder="Enter Section" value={course.section} onChange={onChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Semester</Form.Label>
            <Form.Control type="text" name="semester" id="semester" rows="3" placeholder="Enter Semester" value={course.semester} onChange={onChange} />
          </Form.Group>
        </Form>
          <Button variant="primary" onClick={() => {
            setShowLoading(true);
            onHandleUpdate({
              variables: {
                courseId: course.id,
                courseCode: course.courseCode,
                courseName: course.courseName,
                section: parseInt(course.section),
                semester: course.semester
              }
            }).then(() => {
              setShowLoading(false);
              props.history.push('/showcourse/' + course.id);
              window.location.reload();
            }).catch((err) => {
              console.log(err);
            })
          }}>
            Update
          </Button>
        </Jumbotron>
      </div>
    );
  }
  
  export default withRouter(EditCourse);