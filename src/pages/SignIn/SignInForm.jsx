import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import validator from '../../utils/validator';
import classnames from 'classnames';

const SignInForm = (props) => {
  const [emailAddress1, setEmailAddress1] = useState('');
  const [password1, setPassword1] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    let validatorLogin = validator({
      emailAddress1: emailAddress1,
      password1: password1,
    });
    if (validatorLogin.isValid) {
      setErrors(validatorLogin.errors);
    } else {
      // Restore errors' prompt
      setErrors({});
      props.authActions
        .asyncSetUserObj({
          emailAddress1: emailAddress1,
          password1: password1,
        })
        .then((res) => {
          if (res.data.token) {
            // Success
            props.flashActions.addFlashMessage({
              id: Math.random().toString().slice(2),
              msg: 'log in success',
              type: 'success',
            });
            navigate('/');
          } else {
            props.flashActions.addFlashMessage({
              id: Math.random().toString().slice(2),
              msg: 'log in fail',
              type: 'danger',
            });
          }
        });
    }
  };

  const changeHandle = (e) => {
    const { name, value } = e.target;
    if (name === 'emailAddress1') {
      setEmailAddress1(value);
    } else if (name === 'password1') {
      setPassword1(value);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <h1> Please Log in </h1>
        <div className="form-group">
          <label className="control-label">Email address 1</label>
          <input
            className={classnames('form-control', {
              'is-invalid': errors.username,
            })}
            type="text"
            name="emailAddress1"
            value={emailAddress1}
            onChange={changeHandle}
          />
          {errors.emailAddress1 ? (
            <span style={{ color: 'red', fontSize: '10px' }}>{errors.emailAddress1}</span>
          ) : (
            ''
          )}
        </div>
        <div className="form-group">
          <label className="control-label">PassWord</label>
          <input
            className={classnames('form-control', {
              'is-invalid': errors.password1,
            })}
            type="password"
            name="password1"
            value={password1}
            onChange={changeHandle}
          />
          {errors.password1 ? (
            <span style={{ color: 'red', fontSize: '10px' }}>{errors.password1}</span>
          ) : (
            ''
          )}
        </div>
        <div className="form-group">
          <button className="btn btn-primary btn-lg"> LOG IN </button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
