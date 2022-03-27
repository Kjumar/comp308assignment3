import React, { useState } from 'react';
import {Spinner, Form, Button, Container} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import {gql, useQuery, useMutation} from "@apollo/client";

const ADD_STUDENT = gql`
  mutation addStudent($studentNumber: Int!, $firstName: String!, $lastName: String!, $address: String!, $city: String!, $phoneNumber: String!, $email: String!, $password: String!) {
    addStudent(studentNumber: $studentNumber, firstName: $firstName, lastName: $lastName, address: $address, city: $city, phoneNumber: $phoneNumber, email: $email, password: $password) {
      studentNumber
      firstName
      lastName
      address
      city
      phoneNumber
      email
      password
    }
  }
`;

function CreateStudent(props) {
  const [student, setStudent] = useState({ studentNumber: '', firstName: '', lastName: '', 
                address: '', city: '', phoneNumber: '', email: '',password: '' });
  const [showLoading, setShowLoading] = useState(false);

  const [onHandleRegister, { loading, err, data }] = useMutation(ADD_STUDENT);

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
        <Form>
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
        </Form>
        <Button variant="primary" onClick={() => {
          setShowLoading(true);
          onHandleRegister({
            variables: {
              studentNumber: parseInt(student.studentNumber),
              firstName: student.firstName,
              lastName: student.lastName,
              address: student.address,
              city: student.city,
              phoneNumber: student.phoneNumber,
              email: student.email,
              password: student.password
            }
          }).then((data) => {
            setShowLoading(false);
            props.history.push('/show/' + data.id);
            window.location.reload();
          }).catch((err) => {
            if (err)
            {
              console.log(err);
            }
            setShowLoading(false);
            props.history.push('/students');
            window.location.reload();
          });
        }} >
          Save
        </Button>
      </Container>
    </div>
  );
}

export default withRouter(CreateStudent);