import './App.css';
import Header from './Header';
import React, { Component } from 'react';
import VSidebar from '../containers/vsidebar';
import VMailList from '../containers/vmaillist';
import VMailDetail from '../containers/vmaildetail';
import VComposePart from '../containers/vcomposepart';
import { connect } from 'react-redux';
import MAILS from '../inbox.json';
import api from '../../../api/index';
import { getStorageData } from "../utils/utils";
import SignInForm from '../../SignIn/SignInForm';
import { setEmails } from "../../../reducers/";

const fetchEmails = async () => {
  try {
    const response = await api.fetchEmails();
    
    console.log(response); // Log the entire response object
    if (response && response.data) {
      return response.data // Return the emails here
    } else {
      console.error('Error fetching emails: Invalid server response');
    }
  } catch (error) {
    console.error('Error fetching emails:', error);
  }
};
//mailbox dashboard page and its components
class Mailbox extends Component {
  state = {
    userProfile: {
      name: "",
      email: "",
      profileImage: "",
    },
  };

  updateUserProfile = (name, email, profileImage) => {
    this.setState({
      userProfile: {
        name,
        email,
        profileImage,
      },
    });
  };
  async componentDidMount() {

    let token = getStorageData("AUDIOMAILR_JWT", "NoToken");
    console.log(token);

    if (token !== "NoToken") {
      //if success, apply the fetch gmaildata functions from backend
      //const mails = await fetchEmailsFromBackend();
      const mails = await fetchEmails();
      this.props.fetchData(mails);
      console.log('display gmails:',mails);
      console.log('display local mails:',MAILS.mails);
    } else {
      // if no cookie, show some mock emails from local inox.json for functionalities
      console.log('Failed fetching. Using local mails.');
      this.props.fetchData(MAILS.mails);
    }
  }
  render() {
    const { userProfile } = this.state;
    return (
      <div className="app">
        {/* Pass the userProfile object to the Header component */}
          <Header userProfile={userProfile} />
        <div className="app__body">
          <VSidebar />
          <VMailList />
          <VMailDetail />
          <VComposePart />
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (mails) => {
      dispatch({ type: 'FETCH_DATA_SUCCESS', mails });
    },
  };
};

export default connect(null, mapDispatchToProps)(Mailbox);