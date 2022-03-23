import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Spinner, Jumbotron, Form, Button} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

function EditCourse(props) {
    const [course, setCourse] = useState({ _id: '', courseCode: '', courseName: '', 
                section: '', semester: '' });  
    const [showLoading, setShowLoading] = useState(true);
    const apiUrl = "http://localhost:3000/api/courses/" + props.match.params.id;

    //runs only once after the first render
    useEffect(() => {
      setShowLoading(false);
      //call api
      const fetchData = async () => {
        const result = await axios(apiUrl);
        setCourse(result.data);
        console.log(result.data);
        setShowLoading(false);
      };
  
      fetchData();
    }, [apiUrl]);
  
    const updateCourse = (e) => {
      setShowLoading(true);
      e.preventDefault();
      const data = { _id: course._id, courseCode: course.courseCode, courseName: course.courseName, section: course.section, semester: course.semester };
      axios.put(apiUrl, data)
        .then((result) => {
          setShowLoading(false);
          props.history.push('/showcourse/' + result.data._id)
        }).catch((error) => setShowLoading(false));
    };
    //runs when course field is changed
    const onChange = (e) => {
      e.persist();
      setCourse({...course, [e.target.name]: e.target.value});
    }
  
    return (
      <div>
        {showLoading && 
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner> 
        } 
        <Jumbotron>
          <Form onSubmit={updateCourse}>
          <Form.Group>
            <Form.Label> Course Code</Form.Label>
            <Form.Control type="text" name="courseCode" id="courseCode" placeholder="Enter Course Name" value={course.courseName} onChange={onChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label> Course Name</Form.Label>
            <Form.Control type="text" name="courseName" id="courseName" placeholder="Enter Course Code" value={course.courseCode} onChange={onChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Section</Form.Label>
            <Form.Control type="text" name="section" id="section" rows="3" placeholder="Enter Section" value={course.section} onChange={onChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Semester</Form.Label>
            <Form.Control type="text" name="semester" id="semester" rows="3" placeholder="Enter Semester" value={course.semester} onChange={onChange} />
          </Form.Group>
          
          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
        </Jumbotron>
      </div>
    );
  }
  
  export default withRouter(EditCourse);