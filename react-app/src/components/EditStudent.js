import React, { useState, useEffect } from 'react';
import {Spinner, Jumbotron, Form, Button} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Login from './Login';

import { useAuthToken, useAuthUserToken } from "../config/auth";
import {gql, useQuery, useMutation} from "@apollo/client";

const GET_STUDENT = gql`
query student($studentId: String!) {
  student(id: $studentId) {
    id
    firstName
    lastName
    address
    city
    phoneNumber
    email

  }
}
`;

const UPDATE_STUDENT = gql`
  mutation updateStudent($studentId: String!, $firstName: String!, $lastName: String!, $address: String!, $city: String!, $phoneNumber: String!, $email: String!){
    updateStudent(id: $studentId, firstName: $firstName, lastName: $lastName, address: $address, city: $city, phoneNumber: $phoneNumber, email: $email){
      firstName
      lastName
      address
      city
      phoneNumber
      email
    }
  }
`;

function EditStudent(props) {
    const [showLoading, setShowLoading] = useState(false);
    const studentId = props.match.params.id;

    const [authToken] = useAuthToken()
    const [authUserToken] = useAuthUserToken()

    const { loading, error, data } = useQuery(GET_STUDENT, {
      variables: {studentId: studentId}
    });
    
    const [student, setStudent] = useState(data.student);

    const [onUpdateHandler] = useMutation(UPDATE_STUDENT);
    
    //runs when student enters a field
    const onChange = (e) => {
      e.persist();
      setStudent({...student, [e.target.name]: e.target.value});
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
        <Jumbotron>
          <Form onSubmit={onUpdateHandler}>
          <Form.Group>
            <Form.Label> First Name</Form.Label>
            <Form.Control type="text" name="firstName" id="firstName" placeholder="Enter first name" value={student.firstName} onChange={onChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label> Last Name</Form.Label>
            <Form.Control type="text" name="lastName" id="lastName" placeholder="Enter last name" value={student.lastName} onChange={onChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" name="address" id="address" rows="3" placeholder="Enter address" value={student.address} onChange={onChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>City</Form.Label>
            <Form.Control type="text" name="city" id="city" rows="3" placeholder="Enter city" value={student.city} onChange={onChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="text" name="phoneNumber" id="phoneNumber" rows="3" placeholder="Enter phone number" value={student.phoneNumber} onChange={onChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" name="email" id="email" rows="3" placeholder="Enter email" value={student.email} onChange={onChange} />
          </Form.Group>

          <Button variant="primary" onClick={() => onUpdateHandler({
            variables: {studentId: studentId,
              firstName: student.firstName,
              lastName: student.lastName,
              address: student.address,
              city: student.city,
              phoneNumber: student.phoneNumber,
              email: student.email
            },
            onCompleted: () => {
              setShowLoading(false);
              props.history.push('/show/' + studentId);
              window.location.reload();
            }
          })}>
            Update
          </Button>
        </Form>
        </Jumbotron>
      </div>
    );
  }

  export default withRouter(EditStudent);
