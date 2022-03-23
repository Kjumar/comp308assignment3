import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from "react-router-dom";
import axios from 'axios';
//
import {Navbar, Nav} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
//
import Home from './components/Home';
import Login from './components/Login';
import ListStudents from './components/ListStudents';
//
import CreateStudent from './components/CreateStudent';
import ShowStudent from './components/ShowStudent';
import EditStudent from './components/EditStudent';
//
import ShowCourse from './components/ShowCourse';
import ListCourses from './components/ListCourses';
import EditCourse from './components/EditCourse';

function App() {
  const [loggedIn, setLoggedIn] = useState('auth');
  //check if the user already logged-in
  const readCookie = async () => {
    axios.get('/read_cookie')
      .then(result => {
        //check if the user has logged in
        if(result.data.screen !== 'auth')
        {
          setLoggedIn(result.data.screen);
        }
      }).catch((error) => {
        console.log(error);
        setLoggedIn('auth');
      });
  };
  //runs the first time the view is rendered
  //to check if user is signed in
  useEffect(() => {
    readCookie();
  }, []); //only the first render
  //
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            {loggedIn === 'auth'
              ?
              <Nav.Link href="/login">Login</Nav.Link>
              :
              <Nav.Link href="/login">Profile</Nav.Link>
            }
            <Nav.Link href="/create">Sign Up</Nav.Link>
            <Nav.Link href="/students">Students</Nav.Link>
            <Nav.Link href="/courses">Courses</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div>
        <Route render ={()=> < Home />} path="/home" />
        <Route render ={()=> < Login />} path="/login" />
        <Route render ={()=> < ListStudents />} path="/students" />
        <Route render ={()=> < CreateStudent />} path="/create" />
        <Route render ={()=> < ListCourses />} path="/courses" />
        <Route render ={()=> < ShowStudent />} path="/show/:id" />
        <Route render ={()=> < EditStudent />} path="/edit/:id" />
        <Route render ={()=> < ShowCourse />} path="/showcourse/:id" />
        <Route render ={()=> < EditCourse />} path="/editcourse/:id" />
      </div>
    </Router>
  );
}

export default App;
