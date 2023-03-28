
/* This index.js is a routing configuration page, 
which is a set of instructions used to tell the router how to 
match URLs and how to execute code after matching. */

import React, { Component } from 'react'
import { BrowserRouter as Router,Route,Routes } from "react-router-dom"
import App from "../pages/App"
import SignUpPage from "../pages/SignUp/SignUpPage"
import SignInPage from "../pages/SignIn/SignInPage"
import HeaderNav from "../components/HeaderNav"
import FlashMessageList from "../components/Flash/FlashMessageList"
export default class index extends Component {
  render() {
    return (
      <Router>
        <HeaderNav />
        <FlashMessageList />
        <Routes>
            <Route path='/' element ={ <App/> }></Route>
            <Route path='/signup' element ={ <SignUpPage/> }></Route>
            <Route path='/signin' element ={ <SignInPage/> }></Route>
        </Routes>
      </Router>
    )
  }
}
