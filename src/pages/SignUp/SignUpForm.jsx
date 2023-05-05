import React, { useState } from 'react';
import classnames from 'classnames';
//import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as flashActions from '../../actions/flash';

const SignUpForm = (props) => {
  const [userName, setUserName] = useState('');
  const [emailAddress1, setEmailAddress1] = useState('');
  const [password1, setPassword1] = useState('');
  const [errors, setErrors] = useState({});

  //const navigate = useNavigate();

  //Event handler to update the errors state for the specific input field if the input value is no longer empty.
  const onBlurHandle = (e) => {
    const { name, value } = e.target;
    if (value !== '') {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
  };
  const onSubmit = (e) => {
    e.preventDefault();
    // Simple client-side validation to prevent dull input
    let validationErrors = {};
    if (userName === '') {
      validationErrors.userName = 'Username is required';
    }
    if (emailAddress1 === '') {
      validationErrors.emailAddress1 = 'Email address is required';
    }
    if (password1 === '') {
      validationErrors.password1 = 'Password is required';
    }
  
    // If there are client-side validation errors, set the errors state and return early
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    api
      .signup({
        userName: userName,
        emailAddress1: emailAddress1,
        password1: password1,
      })
      .then((res) => {
        console.log(res.data);
        //console.log("Status Code:", res.data.statusCode);
        if (res.data.token) {
          // Sign up successful
          props.flashActions.addFlashMessage({
            id: Math.random().toString().slice(2),
            msg: "Sign Up Success",
            type: "success",
          });
        } 
          else{
          // Sign up failed
          props.flashActions.addFlashMessage({
            id: Math.random().toString().slice(2),
            msg: res.data.message,
            type: "danger",
          });
        }
        //setErrors(res.data);
      })
      .catch((error) => {
        console.log(error);
        const response = error.response;
        let message = "Something went wrong!";
      
        if (response) {
          message = response.data.message;
        }
      
        props.flashActions.addFlashMessage({
          id: Math.random().toString().slice(2),
          msg: message,
          type: "danger",
        });
      });
      
  };

  const changeHandle = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'userName':
        setUserName(value);
        break;
      case 'emailAddress1':
        setEmailAddress1(value);
        break;
      case 'password1':
        setPassword1(value);
        break;
      default:
        break;
    }
  };

  return (
    <div>
        <form onSubmit={onSubmit}>
            <h1> Register an Account </h1>
            <div className="form-group">
                <label className="control-label"> UserName </label>
                <input                      
                    className={classnames('form-control', { 'is-invalid': errors.userName })}
                    type="text"
                    name="userName"
                    value={userName}
                    onChange={changeHandle}
                    onBlur={onBlurHandle}
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
                    onChange={changeHandle}
                    onBlur={onBlurHandle}
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
                    onChange={changeHandle}
                    onBlur={onBlurHandle}
                />
                {errors.password1 ? <span style={{ color: 'red', fontSize: '10px' }}>{errors.password1}</span> : ''}
            </div>
           
      
           
            <div className="form-group">
            {
                  Object.keys(errors).length > 0 && (userName === '' || emailAddress1 === '' || password1 === '')
                  ? <button disabled className="btn btn-primary btn-lg">Sign Up</button>
                  : <button className="btn btn-primary btn-lg">Sign Up</button>
            }                  
            </div>
        </form>
    </div>
)
};

const mapDispatchToProps = (dispatch) => {
    return {
      flashActions: bindActionCreators(flashActions, dispatch),
    };
  };
  
  export default connect(null, mapDispatchToProps)(SignUpForm);
  
