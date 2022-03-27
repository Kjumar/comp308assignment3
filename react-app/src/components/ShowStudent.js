import React, { useState, useEffect } from 'react';
import {Spinner, Jumbotron, Button, ListGroup} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Login from './Login';

import { useAuthToken, useAuthUserToken } from "../config/auth";
import {gql, useQuery, useMutation} from "@apollo/client";

const GET_STUDENT = gql`
query student($studentId: String!) {
  student(id: $studentId) {
    id
    studentNumber
    firstName
    lastName
    address
    city
    phoneNumber
    email
    
  }
}
`;

const DELETE_STUDENT = gql`
mutation deleteStudent($studentId: String!) {
  deleteStudent(id: $studentId) {
    id
  }
}
`;

const GET_COURSES = gql`
query enrolledCourses($studentId: String!) {
    enrolledCourses(id: $studentId) {
      id
      courseCode
      courseName
      semester
      section
    }
}
`;

function ShowStudent(props) {
  const [courses, setCourses] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const studentId = props.match.params.id;

  const [authToken] = useAuthToken()
  const [authUserToken] = useAuthUserToken()

  const { loading, error, data } = useQuery(GET_STUDENT,
    {
      variables: {studentId: studentId}
    });

  const { courseLoading, courseErr, courseData, refetch } = useQuery(GET_COURSES, {variables: { studentId: studentId },
    onCompleted: (result) => {
      console.log(result);
      setCourses(result.enrolledCourses);
    }
  });
  
  const [onDeleteHandler] = useMutation(DELETE_STUDENT);
    
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

  const editStudent = (id) => {
    props.history.push({
      pathname: '/edit/' + id
    });
  };

  // redirect to the course details page
  const showCourseDetail = (id) => {
    props.history.push({
      pathname: '/showcourse/' + id
    });
  }

  return (
    <div>
      {showLoading && <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner> }    
      <Jumbotron>
        <h1>Name: {data.student.firstName}, {data.student.lastName}</h1> 
        <p>Email: {data.student.email}</p>
        <p>Phone Number: {data.student.phoneNumber}</p>
        <p>Address: {data.student.address}, {data.student.city}</p>
        <p>Student Number: {data.student.studentNumber}</p>

        <p>
          <Button type="button" variant="primary" onClick={() => { editStudent(data.student.id) }}>Edit</Button>&nbsp;
          <Button type="button" variant="primary" onClick={() => refetch() } >View Courses</Button>&nbsp;
          <Button type="button" variant="danger" onClick={() => { onDeleteHandler({
            variables: {studentId: studentId},
            onCompleted: () => {
              setShowLoading(false);
              props.history.push('/students');
              window.location.reload();
            }
          }) }}>Delete</Button>
        </p>

        {courses.length !== 0
                    ?
                    <Jumbotron>
                        <ListGroup>
                            {courses.map((item, idx) => (
                            <ListGroup.Item key={idx} action onClick={() => { showCourseDetail(item.id) }}>
                                {item.courseCode} - {item.courseName} - {item.semester} - Sec. {item.section}
                            </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Jumbotron>
                    :
                    null
                }
      </Jumbotron>
    </div>
  );
}

export default withRouter(ShowStudent);
