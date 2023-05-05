import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import validator from '../../utils/validator';
import classnames from 'classnames';
import Button from "@mui/material/Button";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "./msalConfig";
import GoogleLogin from 'react-google-login';
import api from '../../api/index';

// google
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
//outlook

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
  const { updateUserProfile } = props;
  const navigate = useNavigate();


  const responseGoogle = async (response) => {
    console.log(response);
  
    if (response && response.accessToken) {
      try {
        const result = await fetch('http://localhost:3000/signup/googleoauth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: response.code, // Send the authorization code instead of the access token
      }),
    });
        const data = await result.json();
  
        if (data.token) {
          // Save the token to the local storage or any other state management system
          localStorage.setItem('token', data.token);
          // Call the updateUserProfile function to update the user's profile data
          updateUserProfile(
            response.profileObj.name,
            response.profileObj.email,
            response.profileObj.imageUrl
          );
          // Navigate to the dashboard
          navigate('/receiveMail');
        } else {
          console.log('Authentication failed');
        }
      } catch (error) {
        console.error('Error during authentication:', error);
      }
    } else {
      console.log('No access token received');
    }
  };
  

  
  const GoogleLoginButton = () => {
    const handleGoogleLogin = async () => {
      try {
        const response = await api.getGoogleAuthUrl({ authtype: 'gmail' });
        const url = response.data.url;
        if (url) {
          window.location.href = url;
        } else {
          console.log('Error fetching Google authentication URL');
        }
      } catch (error) {
        console.error('Error fetching Google authentication URL:', error);
      }
    };
  
    return (
      <Button
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleLogin}
        sx={{ backgroundColor: 'lightgray' }}
      ></Button>
    );
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
            navigate('/receiveMail');
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
                <GoogleLoginButton 
                  clientId="<YOUR_GOOGLE_CLIENT_ID>"
                  buttonText="Login with Google"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={"single_host_origin"}            
                />                
                <OutlookLoginButton />
        </div>
      </form>
    </div>


  );
};

export default SignInForm;
