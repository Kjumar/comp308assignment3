
import { withRouter } from 'react-router-dom';

import React, { Component }  from 'react';

function Home(props)
{
    return (
        <div className="jumbotron jumbotron-fluid">
            <div className="container">
            <h1 className="display-4">Lab Assignment 2 - Express - React with CRUD Operations</h1>
            <p className="lead">This is the front end for Home Page. Login to get started!</p>
            </div>
        </div>
    );

}

export default withRouter(Home);