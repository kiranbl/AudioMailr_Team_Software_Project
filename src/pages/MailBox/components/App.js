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
import { getTokenFromStorage } from "../utils/utils";
import { getEmailFromStorage } from "../utils/utils";
import { setEmails } from "../../../constants/index";
import { Buffer } from 'buffer';
import * as authActions from "../../../actions/auth";
import * as flashActions from "../../../actions/flash";
import { bindActionCreators } from "redux";
//decode function for gmail  base64 body
function base64Decode(str) {
  try {
    return Buffer.from(str, 'base64').toString('utf-8');
  } catch (error) {
    console.error('Error decoding base64:', error);
    return str;
  }
}
//mailbox dashboard page and its components
class Mailbox extends Component {
   
  fetchEmails = async () => {
    try {
      const response = await api.fetchEmails();
      console.log('API response:', response);
      console.log(response); // Log the entire response object
      if (response && response.data) {
        // Transform the emails to match the expected format
        const transformedEmails = response.data.map((email) => {
          let decodedBody;
          // Check if the email is from Gmail or Outlook and decode accordingly
          if (email.toAddress.includes("@gmail.com")) {
            // Decode base64 encoded body for Gmail
            decodedBody = base64Decode(email.body);
          } else if (email.toAddress.includes("@outlook.com")) {
            // Use the HTML body directly for Outlook
          //  decodedBody = extractTextFromHtml(email.body);
          //} else {
            // For other cases, use the original body
            decodedBody = email.body;
          }
  
          return {
            email_id: email.email_id,
            from: email.fromAddress,
            address: email.toAddress,
            time: email.createdAt,
            message: decodedBody,
            //message: email.body,
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
  
  fetchSentEmails = async () => {
    try {
      const response = await api.fetchSentEmails();
      console.log('API response (sent):', response);
      if (response && response.data) {
        const transformedEmails = response.data.map((email) => {
          return {
            from: email.fromAddress,
            address: email.toAddress,
            time: email.createdAt,
            message: email.body,
            subject: email.subject,
            read: "ture",
            tag: "sent",
          };
        });
        return transformedEmails;
      } else {
        console.error('Error fetching sent emails: Invalid server response');
      }
    } catch (error) {
      console.error('Error fetching sent emails:', error);
    }
  };
  async handleMarkAsRead(mail_id) {
    try {
      await api.setMailStatus(mail_id);
      const inboxEmails = await this.fetchEmails();
      const sentEmails = await this.fetchSentEmails();
      const mails = [...inboxEmails, ...sentEmails];
      this.props.setEmails(mails);
      console.log('updated mails:', mails);
    } catch (error) {
      console.error('Error setting mail status and fetching emails:', error);
    }
  }
  async componentDidMount() {

    const token = getTokenFromStorage("AUDIOMAILR_JWT", "NoToken");
    const emailaddress = getEmailFromStorage("AUDIOMAILR_JWT", "");
    console.log("Extracted email address:", emailaddress);
    console.log("extract token:",token);
    localStorage.setItem("emailaddress", emailaddress);  // Save the email address to local storage
    if (token !== "NoToken") {
      //if success, apply the fetch gmaildata functions from backend
      //const mails = await fetchEmailsFromBackend();
      const inboxEmails = await this.fetchEmails();
      const sentEmails = await this.fetchSentEmails();
      const mails = [...inboxEmails, ...sentEmails];
      console.log('display inbox mails:',mails);
      console.log('display sent mails:',mails);
      console.log('display transformed mails):', mails);
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
    return (
      <div className="app">
          <Header />
        <div className="app__body">
          <VSidebar />
          <VMailList />
          <VMailDetail handleMarkAsRead={this.handleMarkAsRead.bind(this)} />
          <VComposePart flashActions={this.props.flashActions} />
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
    authActions: bindActionCreators(authActions, dispatch),
    flashActions: bindActionCreators(flashActions, dispatch),
   };
 };

export default connect
(
  null,
  mapDispatchToProps
)(Mailbox);

