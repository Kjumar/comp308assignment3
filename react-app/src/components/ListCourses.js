import React, { useState, useEffect } from 'react';
import {ListGroup, Spinner, Jumbotron} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import {gql, useQuery, useMutation} from "@apollo/client";

const GET_COURSES = gql`
{
    courses {
      id
      courseCode
      courseName
      section
      semester
    }
}
`;

function ListCourses(props) {
  const [showLoading, setShowLoading] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_COURSES);

  const showDetail = (id) => {
    props.history.push({
      pathname: '/showcourse/' + id
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
    console.log(data);

    // TODO: make a nicer error page
    if (error)
    {
      return <p>Error...</p>;
    }

  return (
    <div>
      { data.courses.length !== 0
        ? <Jumbotron>
          {showLoading && <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner> }
          <ListGroup>
            {data.courses.map((item, idx) => (
              <ListGroup.Item key={idx} action onClick={() => { showDetail(item.id) }}>
                {item.courseCode} - {item.courseName} - {item.semester} - Sec. {item.section}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Jumbotron>
        : <p> No courses found! </p>
      }
    </div>

  );
}
//
export default withRouter(ListCourses);
