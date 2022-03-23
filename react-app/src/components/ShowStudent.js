import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Spinner, Jumbotron, Button, ListGroup} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

function ShowStudent(props) {
  const [data, setData] = useState({});
  const [courses, setCourses] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const apiUrl = "http://localhost:5000/students/" + props.match.params.id;

  useEffect(() => {
    setShowLoading(false);
    const fetchData = async () => {
      const result = await axios(apiUrl);
      setData(result.data);
      setShowLoading(false);
      console.log(result.data);
    };

    fetchData();
  }, [apiUrl]);

  const editStudent = (id) => {
    props.history.push({
      pathname: '/edit/' + id
    });
  };

  const deleteStudent = (id) => {
    setShowLoading(true);
    const student = { studentNumber: data.studentNumber, firstName: data.firstName, lastName: data.lastName,
        address: data.address, city: data.city, phoneNumber: data.phoneNumber,
      email: data.email, username: data.username, password: data.password };
  
    axios.delete(apiUrl, student)
      .then((result) => {
        setShowLoading(false);
        props.history.push('/students')
      }).catch((error) => setShowLoading(false));
  };

  // List Courses based upon students enrolled
  const showEnrolledCourses = () => {
    setShowLoading(true);
    axios.put('/api/listcourses', { studentNumber: data.studentNumber }) //pass student number
      .then((result) => {
        setShowLoading(false);
        if (result.data) //if theres courses in the data -> display, else -> dont display
        {
          setCourses(result.data);
        }
        else
        {
          setCourses([]);
        }
      }).catch((error) => {
        setShowLoading(false);
        console.log(error);
      })
  }

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
        <h1>Name: {data.firstName}, {data.lastName}</h1> 
        <p>Email: {data.email}</p>
        <p>Phone Number: {data.phoneNumber}</p>
        <p>Address: {data.address}, {data.city}</p>
        <p>Student Number: {data.studentNumber}</p>

        <p>
          <Button type="button" variant="primary" onClick={() => { editStudent(data._id) }}>Edit</Button>&nbsp;
          <Button type="button" variant="primary" onClick={() => { showEnrolledCourses() }} >View Courses</Button>&nbsp;
          <Button type="button" variant="danger" onClick={() => { deleteStudent(data._id) }}>Delete</Button>
        </p>

        {courses.length !== 0
                    ?
                    <Jumbotron>
                        <ListGroup>
                            {courses.map((item, idx) => (
                            <ListGroup.Item key={idx} action onClick={() => { showCourseDetail(item._id) }}>
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
