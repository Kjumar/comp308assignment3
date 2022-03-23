import React, { useState, useEffect } from 'react';
//import ReactDOM from 'react-dom';
import { Form, Button, Jumbotron } from 'react-bootstrap';
import axios from 'axios';
import View from './View';
//
function App() {
  //state variable for the screen, admin or user
  const [screen, setScreen] = useState('auth');
  const [name, setName] = useState('');
  //store input field data, student number and password
  const [studentNumber, setStudentNumber] = useState();
  const [password, setPassword] = useState();
  const apiUrl = "http://localhost:3000/signin";
  //send username and password to the server
  // for initial authentication
  const auth = async () => {
    console.log('calling auth')
    console.log(studentNumber)
    try {
      //make a get request to /authenticate end-point on the server
      const loginData = { auth: { studentNumber, password } }
      //call api
      const res = await axios.post(apiUrl, loginData);
      //process the response
      console.log(res.data);
      if (res.data.screen !== undefined) {
        setScreen(res.data.screen);
        setName(res.data.name);
        console.log(res.data.screen);
      }
    } catch (e) { //print the error
      console.log(e);
    }
  
  };
  //check if the user already logged-in
  const readCookie = async () => {
    axios.get('/read_cookie')
      .then(result => {
        //check if the user has logged in
        if(result.data.screen !== 'auth')
        {
          setScreen(result.data.screen);
          setName(result.data.name);
        }
      }).catch((error) => {
        console.log(error);
        setScreen('auth');
      });
  };
  //runs the first time the view is rendered
  //to check if user is signed in
  useEffect(() => {
    readCookie();
  }, []); //only the first render
  //

  return (
    <div className="App">
      {screen === 'auth' 
        ?
        <Jumbotron>
          <Form>
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
          <Button onClick={auth}>Login</Button>
        </Jumbotron>
        : <View screen={screen} setScreen={setScreen} name={name} setName={setName} />
      }
    </div>
  );
}
  
export default App;