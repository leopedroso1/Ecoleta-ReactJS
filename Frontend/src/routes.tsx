// This library is used for transitions between web pages.
import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom'; // DO NOT FORGET: npm install @types/react-router-dom -D
import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';

const Routes = () => {

    /* Each Route has a specific path in the browser. This will need to be linked with Backend */
    /* Important: React JS do not check the full path just the beginning. For this reason we need to assign "exact" as an attribute */
    return (
        <BrowserRouter>
            <Route component={Home} path="/" exact /> 
            <Route component={CreatePoint} path="/create-point" exact />
        </BrowserRouter>

    );
}

export default Routes;