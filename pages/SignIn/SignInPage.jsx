import React, { Component } from 'react'
import SignInForm from "./SignInForm"
class SignInPage extends Component {
    render() {
      return (
        <div className="row no-margin-padding">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <SignInForm/>
          </div>
          <div className="col-md-3"></div>
        </div>
      );
    }
  }

export default SignInPage