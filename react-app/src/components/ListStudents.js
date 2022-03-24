import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {ListGroup, Spinner, Jumbotron} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Login from './Login';

import { useAuthToken, useAuthUserToken } from "../config/auth";
import {gql, useQuery} from "@apollo/client";

const GET_STUDENTS = gql`
{
    students {
      id
      firstName
      lastName
      email
    }
}
`;

function ListStudents(props) {
  const [showLoading, setShowLoading] = useState(true);

  const [authToken] = useAuthToken()
  const [authUserToken] = useAuthUserToken()

  const { loading, error, data , refetch } = useQuery(GET_STUDENTS);
  console.log(data);
  
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
  if (error) return <p>Error...</p>;

  const showDetail = (id) => {
    props.history.push({
      pathname: '/show/' + id
    });
  }

  if (authToken)
  {
    return (
      <div>
        <Jumbotron>
          <ListGroup>
            {data.students.map((item, idx) => (
              <ListGroup.Item key={idx} action onClick={() => { showDetail(item.id) }}>{item.lastName}, {item.firstName}</ListGroup.Item>
            ))}
          </ListGroup>
        </Jumbotron>
      </div>

    );
  }

  return (
    <div>
      <Login />
    </div>
  )
}
//
export default withRouter(ListStudents);
