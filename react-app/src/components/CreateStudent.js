import React, { useState } from 'react';
import axios from 'axios';
import {Spinner, Form, Button, Container} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

function CreateStudent(props) {
  const [student, setStudent] = useState({ _id: '', firstName: '', lastName: '', 
                address: '', city: '', phoneNumber: '', email: '',password: '' });
  const [showLoading, setShowLoading] = useState(false);
  const apiUrl = "http://localhost:3000/";

  const saveStudent = (e) => {
    setShowLoading(true);
    e.preventDefault();
    const data = { studentNumber: student.studentNumber, firstName: student.firstName, lastName: student.lastName, 
      address: student.address, city: student.city, phoneNumber: student.phoneNumber,
      email: student.email, password: student.password };
    axios.post(apiUrl, data)
      .then((result) => {
        setShowLoading(false);
        props.history.push('/show/' + result.data._id)
      }).catch((error) => setShowLoading(false));
  };

  const onChange = (e) => {
    e.persist();
    setStudent({...student, [e.target.name]: e.target.value});
  }

  return (
    <div>
      {showLoading && 
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner> 
      } 
      <Container>
      <h1 className="mt-3">Create New Student</h1>
        <Form onSubmit={saveStudent}>
          <Form.Group className='mb-2'>
            <Form.Label>Student Number</Form.Label>
            <Form.Control type="text" name="studentNumber" id="studentNumber" rows="3" placeholder="Enter student number" value={student.studentNumber} onChange={onChange} />
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label> First Name</Form.Label>
            <Form.Control type="text" name="firstName" id="firstName" placeholder="Enter first name" value={student.firstName} onChange={onChange} />
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label> Last Name</Form.Label>
            <Form.Control type="text" name="lastName" id="lastName" placeholder="Enter last name" value={student.lastName} onChange={onChange} />
          </Form.Group >
          <Form.Group className='mb-2'> 
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" name="address" id="address" rows="3" placeholder="Enter address" value={student.address} onChange={onChange} />
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>City</Form.Label>
            <Form.Control type="text" name="city" id="city" rows="3" placeholder="Enter city" value={student.city} onChange={onChange} />
          </Form.Group>
          <Form.Group className='mb-2'> 
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="text" name="phoneNumber" id="phoneNumber" rows="3" placeholder="Enter phone number" value={student.phoneNumber} onChange={onChange} />
          </Form.Group>
          <Form.Group className='mb-2'>
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" name="email" id="email" rows="3" placeholder="Enter email" value={student.email} onChange={onChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" id="password" placeholder="Enter password" value={student.password} onChange={onChange} />
          </Form.Group>
          
          <Form.Group className='mt-3 mb-3'>
          <Button variant="primary" type="submit">
            Save
          </Button>
          </Form.Group>
        </Form>
      </Container>
    </div>
  );
}

export default withRouter(CreateStudent);