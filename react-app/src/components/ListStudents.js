import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {ListGroup, Spinner, Jumbotron} from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Login from './Login';

function ListStudents(props) {
  const [data, setData] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [listError, setListError] = useState(false);
  const apiUrl = "http://localhost:3000/students";

  useEffect(() => {
    const fetchData = async () => {
      axios.get(apiUrl)
        .then(result => {
          console.log('result.data:',result.data)
          //check if the user has logged in
          if(result.data.screen !== 'auth')
          {
            
            console.log('data in if:', result.data )
            setData(result.data);
            setShowLoading(false);
          }
        }).catch((error) => {
          console.log('error in fetchData:', error)
          setListError(true)
        });
      };  
    fetchData();
  }, []);

  const showDetail = (id) => {
    props.history.push({
      pathname: '/show/' + id
    });
  }

  return (
    <div>
      { data.length !== 0
        ? <Jumbotron>
          {showLoading && <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner> }
          <ListGroup>
            {data.map((item, idx) => (
              <ListGroup.Item key={idx} action onClick={() => { showDetail(item._id) }}>{item.lastName}, {item.firstName}</ListGroup.Item>
            ))}
          </ListGroup>
        </Jumbotron>
        : < Login />
      }
    </div>

  );
}
//
export default withRouter(ListStudents);
