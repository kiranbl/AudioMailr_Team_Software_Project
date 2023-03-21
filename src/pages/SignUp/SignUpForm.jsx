import React, { Component } from 'react'
import classnames from "classnames"
import { withRouter } from "react-router-dom"
//import styles from './SignUpForm.module.css';
import api from "../../api"



export default class SignUpForm extends Component {

        /**
         * In our case, controlled components are implemented so data is handled by the component's state because
         * we chose the way where forms are used to store information in a document section. 
         * The information from these forms will be sent to our server to perform actions.
         */

        /**
         * Detail of classnames library see README
         */

        constructor() {
            super();
            this.state = {
                userName: "",
                emailAddress1: "",
                password1: "",
                errors: {}
            }
        }
    
        onSubmit = (e) => {
            /**
            * event handling function of user input
            */
            e.preventDefault();
            console.log(this.state)
// Simple client-side validation
  let validationErrors = {};
  if (this.state.userName === "") {
    validationErrors.userName = "Username is required";
  }
  if (this.state.emailAddress1 === "") {
    validationErrors.emailAddress1 = "Email address is required";
  }
  if (this.state.password1 === "") {
    validationErrors.password1 = "Password is required";
  }

  // If there are client-side validation errors, set the errors state and return early
  if (Object.keys(validationErrors).length > 0) {
    this.setState({ errors: validationErrors });
    return;
  }
            api.signup({
                userName: this.state.userName,
                emailAddress1: this.state.emailAddress1,
                password1: this.state.password1,
            }).then(res => {
                console.log(res.data)
                this.setState({
                    errors:res.data
                })
                
            }).catch(error => {
                console.log(error)
            })

        }   
        changeHandle = (e) => {
           /**
            * This is a handler function using arrow function syntax.
            * It takes an event object e as its argument
            * It updates the state of component whenever an input field is changed. 
            * The event fires, this function is called with the event object e.
            * Inside the function: Computed property name [e.target.name] is used to create dynamic property names for objects. 
            * In this case, the property name is determined by the value of e.target.name. 
            * e.target refers to the input element that triggered the event, and name is an attribute of the input element.
            */
            this.setState({
                [e.target.name]: e.target.value
            })
        }

        render() {
        const { userName, emailAddress1,  password1,  errors } = this.state;
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <h1>Register an Account</h1>
                    <div className="form-group">
                        <label className="control-label"> UserName </label>
                        <input                      
                            className={classnames('form-control', { 'is-invalid': errors.userName })}
                            type="text"
                            name="userName"
                            value={userName}
                            onChange={this.changeHandle}
                            onBlur={ this.onBlurCheckUserName }
                        />
                        {errors.userName ? <span style={{ color: 'red', fontSize: '10px' }}>{errors.userName}</span> : ''}
                    </div>
                    <div className="form-group">
                        <label className="control-label">EmailAddress</label>
                        <input
                            className={classnames('form-control', { 'is-invalid': errors.emailAddress1 })}
                            type="text"
                            name="emailAddress1"
                            value={emailAddress1}
                            onChange={this.changeHandle}
                        />
                        {errors.emailAddress1 ? <span style={{ color: 'red', fontSize: '10px' }}>{errors.emailAddress1}</span> : ''}
                    </div>
                    <div className="form-group">
                        <label className="control-label">PassWord</label>
                        <input
                            className={classnames('form-control', { 'is-invalid': errors.password1 })}
                            type="password"
                            name="password1"
                            value={password1}
                            onChange={this.changeHandle}
                        />
                        {errors.password1 ? <span style={{ color: 'red', fontSize: '10px' }}>{errors.password1}</span> : ''}
                    </div>
                   
              
                   
                    <div className="form-group">
                        {
                            Object.keys(errors).length > 0 ?
                            <button disabled className="btn btn-primary btn-lg">Sign Up</button>
                            :
                            <button className="btn btn-primary btn-lg">Sign Up</button>
                        }                      
                    </div>
                </form>
            </div>
        )
    }
}
