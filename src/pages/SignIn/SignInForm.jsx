import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import validator from '../../utils/validator';
import classnames from 'classnames';
//import { setUserObj } from "../../actions/auth";
import Button from "@mui/material/Button";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "./msalConfig";
import GoogleLogin from 'react-google-login';

//3 provider icons and their response const

//1 google
function GoogleIcon() {
  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
      alt="Google G Logo"
      width="30" 
      height="30"
    />
  );
}


// Add your Google client ID here
const GOOGLE_CLIENT_ID = 'your-google-client-id.apps.googleusercontent.com';

const responseGoogle = (response) => {
  console.log(response);

  // Here, you can handle the Google login response, extract user data, and authenticate them in your application.
};

const GoogleLoginButton = () => (
  <GoogleLogin
    clientId={GOOGLE_CLIENT_ID}
    render={(renderProps) => (
      <Button
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={renderProps.onClick}
        disabled={renderProps.disabled}
        sx={{ backgroundColor: 'lightgray' }}
      ></Button>
    )}
    buttonText="Login with Google"
    onSuccess={responseGoogle}
    onFailure={responseGoogle}
    cookiePolicy={'single_host_origin'}
  />
);

//2yahoo
function YahooIcon() {
  return (
    <imghttp
      src="https://upload.wikimedia.org/wikipedia/commons/3/3a/Yahoo%21_%282019%29.svg"
      alt="Yahoo Logo"
      width="30" 
      height="30"
    />
  );
}
//3outlook

const msalInstance = new PublicClientApplication(msalConfig);

function OutlookIcon() {
  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg"
      alt="Outlook Logo"
      width="30" 
      height="30"
    />
  );
}

const handleOutlookLogin = async () => {
  try {
    const response = await msalInstance.loginPopup(loginRequest);
    console.log(response);
    // Here, you can handle the Outlook login response, extract user data, and authenticate them in your application.
  } catch (error) {
    console.error("Error during Outlook login:", error);
  }
};

const OutlookLoginButton = () => (
  <Button
    variant="contained"
    startIcon={<OutlookIcon />}
    onClick={handleOutlookLogin}
    sx={{ backgroundColor: 'lightgray' }}
  ></Button>
);

//sign in form
const SignInForm = (props) => {
  const [emailAddress1, setEmailAddress1] = useState('');
  const [password1, setPassword1] = useState('');
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleProviderLogin = (provider) => {
    // handle the provider login logic here (Google, Yahoo, Outlook)
    console.log(`${provider} login clicked`);
  };

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
            //props.authActions.asyncSetUserObj(res.data.user);
            //console.log("User prop:",  res.data.user);
            navigate('/mailbox');
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

      <form>

        <h2>Or sign in with</h2>
        <div className="provider-icons">


                <GoogleLoginButton />

                <OutlookLoginButton />


        </div>
      </form>
    </div>


  );
};

export default SignInForm;
