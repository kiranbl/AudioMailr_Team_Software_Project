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
import { setEmails } from "../../../constants/index";
import { Buffer } from 'buffer';
//decode function for gmail  base64 body
function base64Decode(str) {
  return Buffer.from(str, 'base64').toString('utf-8');
}
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
  
   fetchEmails = async () => {
    try {
      const response = await api.fetchEmails();
      console.log('API response:', response);
      console.log(response); // Log the entire response object
      if (response && response.data) {
        // Transform the Gmail emails to match the expected format
        const transformedEmails = response.data.map(
          (
          email, 
          //index
          ) => {
        // Decode base64 encoded body
          const decodedBody = base64Decode(email.body);        
          return {
            //id: index,
            from: email.fromAddress, 
            address: email.toAddress, 
            time: email.createdAt, 
            message: decodedBody, 
            subject: email.subject, 
            read: email.status === "read" ? "true" : "false",
            tag: "inbox",
          };
        });
        return transformedEmails;
      } else {
        console.error('Error fetching emails: Invalid server response');
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };
  async componentDidMount() {

    let token = getStorageData("AUDIOMAILR_JWT", "NoToken");
    console.log(token);

    if (token !== "NoToken") {
      //if success, apply the fetch gmaildata functions from backend
      //const mails = await fetchEmailsFromBackend();
      const mails = await this.fetchEmails();
      console.log('display transformed gmails:',mails);
      console.log('display local mails:',MAILS.mails);
      this.props.setEmails(mails);
    } else {
      // if no cookie, show some mock emails from local inox.json for functionalities
      console.log('Failed fetching. Using local mails.');
      console.log('display local mails:',MAILS.mails);
      this.props.setEmails(MAILS.mails);
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
    setEmails: (mails) => {
    dispatch(setEmails(mails));
     },
   };
 };

export default connect
(
  null,
  mapDispatchToProps
)(Mailbox);

