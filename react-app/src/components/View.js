import CreateCourse from './CreateCourse';
import { withRouter } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {ListGroup, Spinner, Jumbotron, Button, ButtonGroup, ToggleButton} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useAuthToken, useAuthUserToken, useLogout } from "../config/auth";
import {gql, useQuery, useMutation} from "@apollo/client";

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

const GET_STUDENT = gql`
query student($studentId: String!) {
  student(id: $studentId) {
    id
    studentNumber
    firstName
    lastName
  }
}
`;

const REMOVE_COURSE = gql`
mutation unenrollStudent($studentId: String!, $courseId: String!) {
    unenrollStudent(studentId: $studentId, courseId: $courseId) {
        id
        studentNumber
    }
}
`;

function View (props) {
    const { screen, setScreen, name, setName} = props;
    const [student, setStudent] = useState({id: '', studentNumber: '', firstName: '', lastName: ''});
    const [course, setCourse] = useState('');
    const [courses, setCourses] = useState([]);
    const [deleteMode, setDeleteMode] = useState(false);

    const [authToken] = useAuthToken()
    const [authUserToken] = useAuthUserToken()
    console.log(authUserToken);
    const logout = useLogout();

    const { loading, error, data, refetch } = useQuery(GET_COURSES, {variables: { studentId: authUserToken }});

    useQuery(GET_STUDENT, {
        variables: {studentId: authUserToken },
        onCompleted: (result) => {
            setStudent(result.student);
        }
    })

    const [onHandleUnenroll] = useMutation(REMOVE_COURSE);

    const createCourse = () => {
        console.log('in createCourse');
        setCourse('y');
    };

    const showCourseDetail = (id) => {
        if (deleteMode)
        {
            onHandleUnenroll({
                variables: {studentId: authUserToken, courseId: id},
            }).then(() => {
                refetch();
            }).catch((err) => {
                console.log(err);
            })
        }
        else
        {
            props.history.push({
                pathname: '/showcourse/' + id
              });
        }
    };

    return (
        <div className="App">
        {course !== 'y'
            ? <Jumbotron className="text-center">
                <p>{student.firstName} {student.lastName}</p>
                <Button variant="primary" onClick={createCourse}>Create Course</Button>{' '}
                <Button variant="primary" onClick={() => {}}>List Courses</Button>{' '}

                <Button variant="info" onClick={logout}>Log out</Button>

                {(data && data.enrolledCourses && data.enrolledCourses.length !== 0)
                    ?
                    <Jumbotron>
                        <ButtonGroup toggle className="mb-2">
                            <ToggleButton
                            type="checkbox"
                            variant="outline-danger"
                            checked={deleteMode}
                            value="1"
                            onChange={(e) => setDeleteMode(e.currentTarget.checked)}
                            >
                            Drop Courses
                            </ToggleButton>
                        </ButtonGroup>
                        <ListGroup>
                            {data.enrolledCourses.map((item, idx) => (
                            <ListGroup.Item key={idx} action onClick={() => { showCourseDetail(item.id) }}>
                                {item.courseCode} - {item.courseName} - {item.semester} - Sec. {item.section}
                            </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Jumbotron>
                    :
                    <div>
                        <p>no courses to show</p>
                    </div>
                }
            </Jumbotron>            
            : <CreateCourse screen={screen} setScreen={setScreen} />
        }
        </div>
    );
}

export default withRouter(View);