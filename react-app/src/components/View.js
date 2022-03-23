import CreateCourse from './CreateCourse';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {ListGroup, Spinner, Jumbotron, Button, ButtonGroup, ToggleButton} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function View (props) {
    const { screen, setScreen, name, setName} = props;
    const [data, setData] = useState();
    const [course, setCourse] = useState('');
    const [courses, setCourses] = useState([]);
    const [deleteMode, setDeleteMode] = useState(false);

    const deleteCookie = async () => {
        try {
            await axios.get('/signout');
            setScreen('auth');
        } catch (e) {
            console.log(e);
        }
    };

    const verifyCookie = async () => {
        axios.get('/welcome')
            .then(result => {
                console.log(result.data);
                setData(result.data);
            }).catch((error) => {
                console.log(error);
            });
    };

    const listCourses = (studentNumber) => {
        console.log('in listCourses: ', screen);
        if (screen !== 'auth' && screen !== undefined)
        {
            axios.put('/api/listcourses', { studentNumber: screen})
                .then(result => {
                    console.log(result.data);
                    if (result.data !== null) { setCourses(result.data); }
                    else { setCourses([]); }
                }).catch((error) => {
                    console.log(error);
                });
        }
    };

    const createCourse = () => {
        console.log('in createCourse');
        setCourse('y');
    };

    const showCourseDetail = (id) => {
        if (deleteMode)
        {
            axios.put('/api/removecourse', {courseId: id, studentNumber: data})
                .then(result => {
                    console.log(result.data);
                    listCourses(screen);
                }).catch((error) => {
                    console.log(error);
                });
        }
    };

    useEffect(() => {
        verifyCookie();
      }, []); //only the first render

    return (
        <div className="App">
        {course !== 'y'
            ? <Jumbotron className="text-center">
                <p>{name}</p>
                <p>{data}</p>
                <Button variant="primary" onClick={verifyCookie}>Verify Cookie</Button>{' '}
                <Button variant="primary" onClick={createCourse}>Create Course</Button>{' '}
                <Button variant="primary" onClick={() => listCourses(data)}>List Courses</Button>{' '}

                <Button variant="info" onClick={deleteCookie}>Log out</Button>

                {courses.length !== 0
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
                            {courses.map((item, idx) => (
                            <ListGroup.Item key={idx} action onClick={() => { showCourseDetail(item._id) }}>
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

export default View;