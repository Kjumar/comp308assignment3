import React, { useState, useEffect } from 'react';
//import ReactDOM from 'react-dom';
import { Form, Button, Jumbotron } from 'react-bootstrap';
import axios from 'axios';
import View from './View';
//
import { useLoginMutation } from "../network/loginMutation";
import { useAuthToken, useAuthUserToken } from "../config/auth";
//
function App() {
  const [loginMutation, loginMutationResults] = useLoginMutation();
  const [authToken] = useAuthToken();
  const [authUserToken] = useAuthUserToken();
  //state variable for the screen, admin or user
  const [screen, setScreen] = useState('auth');
  const [name, setName] = useState('');
  //store input field data, student number and password
  const [studentNumber, setStudentNumber] = useState();
  const [password, setPassword] = useState();
  //
  const onSubmit = () => {
    loginMutation(studentNumber, password);
    console.log(loginMutationResults);
  }

  if (authToken)
  {
    return (
      <div className="App">
        <View screen={screen} setScreen={setScreen} name={name} setName={setName} />
      </div>
    )
  }

  return (
    <div className="App">
      <Jumbotron>
        <Form >
        <h1 className="mt-3">Please Log In</h1>
          <Form.Group className='mb-3'>
              <Form.Label>Student Number:</Form.Label>
              <Form.Control type="text" onChange={e => setStudentNumber(e.target.value)}/>
          </Form.Group>
          <Form.Group className='mb-3'>
              <Form.Label>Password: </Form.Label>
              <Form.Control type="password" onChange={e => setPassword(e.target.value)}/>
          </Form.Group>
        </Form>
        <Button onClick={onSubmit} >Login</Button>
      </Jumbotron>
    </div>
  );
}
  
export default App;