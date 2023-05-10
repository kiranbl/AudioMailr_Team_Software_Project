const nodemailer = require("nodemailer");
const validator = require("../utilities/validationUtilities");
const dbQueryUtilities = require("../utilities/dbQueryUtilities");
const dbUtilities = require("../utilities/dbUtilities");
const  { google } = require('googleapis');
const MOMENT= require( 'moment' );

const axios = require('axios');

var sendMailErrorCode = (statusCode,email) => {
  switch (statusCode) {
    case 6000:
      return { errorcode: statusCode, message: `Mail has been sent to ${email} successfully..` };
      case 6001:
      return { errorcode: statusCode, message: `Authorization Expired, Login Again` };
  }
}; 

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI

);

// Function to send the mail based on the provider using SMTP using Nodemailer for Gmail and sendMail Microsoft Graph Mail API for Outlook
let transportMail = async (data,emailTemplate) =>{
  let transporter;
  if(data.provider === "gmail"){
    // Using googleapi to generate access token using the refresh token
    oauth2Client.setCredentials({
      refresh_token: data.refreshToken
 });

 // Getting the generated access token
 const accessToken = await oauth2Client.getAccessToken();
 //console.log("TOKEN ===>>>> ",accessToken);
  
  // Creating a transport using nodemailer to send the mail
  transporter = nodemailer.createTransport({
      service:data.provider,
      auth: {
        type: "OAuth2",
        user: data.emailAddress1,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret:process.env.GMAIL_CLIENT_SECRET,
        accessToken: accessToken.res.data.access_token
      }
    });
    // Verifying the transporter
  transporter.verify(function(error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  // Sending the mail with all the email data
  let info = await transporter.sendMail({
    from: data.emailAddress1, // sender address
    to: emailTemplate.toAddress, // list of receivers
    subject: emailTemplate.subject, // Subject line
    text: emailTemplate.body, // plain text body
    html:(emailTemplate.html)?emailTemplate.html:"", // html body
  });
  
  //console.log(info);
  return info
  }
  if(data.provider === "outlook"){
  
  // Constructing the json object containing the email data
  let msgPayload = { 
    //Ref: https://learn.microsoft.com/en-us/graph/api/resources/message#properties
    message: {
      subject: emailTemplate.subject,
      body:{
        contentType: 'Text',
        content: emailTemplate.body  
      },
      toRecipients: [{emailAddress: {address: emailTemplate.toAddress}}]
    }
  }; //using axios as http helper

  //Sending an axios request to send mail using the Outlook graph mail api
  let sendOutlookMail = await axios ({ // Send Email using Microsoft Graph
    method: 'post',
    url: `https://graph.microsoft.com/v1.0/users/${data.emailAddress1}/sendMail`,
    headers: {
      'Authorization': "Bearer " + data.refreshToken,
      'Content-Type': 'application/json'
    },
    data: msgPayload
  });
  //console.log("ERRORRRR SEND OUTLOOK",sendOutlookMail);
  
  if(sendOutlookMail.status === 202){
  return sendOutlookMail;
    }
  }
}

//Function to send email and storing the sent mail in the database
let sendEmail = async (data,emailTemplate) =>{
    try{
      //console.log(data)
      let transporterResponse = await transportMail(data,emailTemplate);

      
      emailTemplate["fromAddress"]= data.emailAddress1;
      if(transporterResponse){
       emailTemplate["user_id"] = data.user_id;
       emailTemplate["createdAt"] = MOMENT().format( 'YYYY-MM-DD  HH:mm:ss.000' );
        
        //Storing the sent email in the database
        let insertquery = `INSERT INTO sent `;
        let insertqueryType = "insert";
        let generatedQuery = dbQueryUtilities.queryBuilder(insertqueryType, emailTemplate);
        insertquery = insertquery + generatedQuery;
        var queryResponse = await dbUtilities.createQuery(insertquery);
        //console.log("Query res", queryResponse);
        if(queryResponse.errorcode) return queryResponse

        return(sendMailErrorCode(6000,emailTemplate.toAddress));
      }
    }
    catch(error){
      console.log(error)
    }
   

}



// Handler to send the email and storing the data in the database
let sendMailHandler = async (req,res)=>{
  //console.log("Body",req.body)
    if (!Object.keys(req.body).length) {
       return res.status(400).json({
          statusCode: 400,
          message: "Body can not be empty!",
        });
  }else {
    // Calling the emailValidator to validate the body containing mail data to be sent
    var validatorResponse = validator.emailValidator(req.body);
    if (validatorResponse) {
      return res.json(validatorResponse);
    }
    var emailTemplate = {
      toAddress: req.body.toAddress,
      subject: req.body.subject,
      body:req.body.text
    };
    
    if(req.body.html){
        emailTemplate["html"] = req.body.html
    }
    
    //Calling the sendEmail function to send the mail and store it in the database
    var sendEmailResponse = await sendEmail(req.decodedData,emailTemplate);
    return res.json(sendEmailResponse);
  }

}


module.exports = sendMailHandler;
