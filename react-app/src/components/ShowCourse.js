import React, { useState, useEffect } from 'react';
import {Spinner, Jumbotron, Button, ListGroup} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

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

const DELETE_COURSE = gql`
mutation deleteCourse($courseId: String!) {
  deleteCourse(id: $courseId) {
    id
  }
}
`;

const ENROLL_STUDENT = gql`
mutation enrollStudent($studentId: String!, $courseId: String!) {
  enrollStudent(studentId: $studentId, courseId: $courseId) {
    id
    courses
  }
}
`;

const GET_STUDENTS = gql`
query enrolledStudents($courseId: String!) {
  enrolledStudents(courseId: $courseId) {
    id
    studentNumber
    firstName
    lastName
    email
  }
}
`;

function ShowCourse(props) {
  const [showLoading, setShowLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const courseId = props.match.params.id;

  const [authToken] = useAuthToken()
  const [authUserToken] = useAuthUserToken()

  const { loading, error, data } = useQuery(GET_COURSE, {
    variables: { courseId: courseId }
  });

  const { refetch } = useQuery(GET_STUDENTS, {
    variables: { courseId: courseId },
    onCompleted: (result) => {
      console.log(result);
      setStudents(result.enrolledStudents);
    }
  })

  const [onHandleDelete] = useMutation(DELETE_COURSE);

  const [onHandleEnroll] = useMutation(ENROLL_STUDENT);

  const editCourse = (id) => {
    props.history.push({
      pathname: '/editcourse/' + id
    });
  };

  const showStudent = (id) => {
    props.history.push({
      pathname: '/show/' + id
    });
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
      {showLoading && <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner> }    
      <Jumbotron>
        <h1>Course Name: {data.course.courseName}</h1>
        <h2>Course Code: {data.course.courseCode}</h2>
        <p>Section: {data.course.section}</p>
        <p>Semester: {data.course.semester}</p>

        {authToken
          ?
          <p>
            <Button type="button" variant="primary" onClick={() => { editCourse(data.course.id) }}>Edit</Button>&nbsp;
            <Button type="button" variant="primary" onClick={() => { refetch() }}>View Classlist</Button>&nbsp;
            <Button type="button" variant="primary" onClick={() => {
              setShowLoading(true);
              onHandleEnroll({
                variables: { studentId: authUserToken, courseId: courseId }
              }).then(() => {
                setShowLoading(false);
                props.history.push('/courses');
                window.location.reload();
              }).catch((err) => {
                console.log(err);
              });
            }}>Enroll</Button>&nbsp;
            <Button type="button" variant="danger" onClick={() => {
              setShowLoading(true);
              onHandleDelete({
                variables: { courseId: courseId }
              }).then(() => {
                setShowLoading(false);
                props.history.push('/courses');
                window.location.reload();
              });
            }}>Delete</Button>
          </p>
          :
          null
        }

        {students.length !== 0
                    ?
                    <Jumbotron>
                        <ListGroup>
                            {students.map((item, idx) => (
                            <ListGroup.Item key={idx} action onClick={() => { showStudent(item.id) }}>
                                {item.lastName}, {item.firstName}
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

export default withRouter(ShowCourse);
