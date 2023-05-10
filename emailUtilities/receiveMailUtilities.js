const  { google } = require('googleapis');
const axios = require("axios");
const MOMENT= require( 'moment' );
const dbQueryUtilities = require("../utilities/dbQueryUtilities");
const dbUtilities = require("../utilities/dbUtilities");
const {getInboxEmail} = require("./getMailUtilities")


const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI

);

// function to get the unread email ids from the database based on the user id
let getSavedUnreadMail =async (data)=>{

  var existingemailids = {
    conditionData: {
     user_id: data.user_id,
     status: "unread",
    },
    conditionType: 'AND',
    selectionData: ["email_id"],
    tablename: "inbox",
  };

  let selectQuery = `Select `;
  let generatedSelectQuery = dbQueryUtilities.queryBuilder("select", existingemailids);
  selectQuery = selectQuery + generatedSelectQuery;

  var selectQueryResponse = await dbUtilities.selectQuery(selectQuery);
  console.log("Select Query res", selectQueryResponse);
  return selectQueryResponse;

  
}

//fucntion to get the mail body returned by gmail in multipart format
let gmailBodyPart = (parts) =>{
  //console.log("reached here")
  //console.log(parts)
  if(parts[0].body.size === 0){
    //console.log("reached inside if")
    return gmailBodyPart(parts[0].parts)
  }else{
    return parts[0].body.data;
  }
}

// function to get mail data from gmail mailbox and store it in the database
let storeGmailData = async (accessToken,data,unreadMessagesID)=>{
  try{
    //console.log(data)
    //console.log(unreadMessagesID)
    let x = unreadMessagesID;
    //console.log(x.length)
    for(let i=0;i<x.length;i++){

      // making an axios request to gmail api to get the mail data
      let emailData = await axios.get(
        ` https://gmail.googleapis.com/gmail/v1/users/${data.emailAddress1}/messages/${x[i]}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.token}`,
          },
        },
      );
      // if(emailData.response.status === 401){
      //   return(receiveMailErrorCode(7001))
      // }
      //console.log(emailData)
       
      // Creating a json object to structure the mail data returned from the request
      let obj = {
         email_id:x[i]
        }

      emailData.data.payload.headers.forEach(h =>{

        if(h.name==="From" && h.value.includes("<")){
          obj["fromAddress"] = h.value.toString().replace(/"/g, '').replace(/'/g,'');
        }
        else if(h.name==="From"){
          obj["fromAddress"] = h.value.toString().replace(/"/g, '').replace(/'/g,'');
        }
        if(h.name==="To" && h.value.includes("<")){ 
          obj["toAddress"] = h.value.toString().replace(/"/g, '').replace(/'/g,'');
        }
        else if(h.name==="To"){
          obj["toAddress"] = h.value.toString().replace(/"/g, '').replace(/'/g,'');
        }

        
        if(h.name==="Date"){
            obj["createdAt"]= MOMENT(h.value).format( 'YYYY-MM-DD  HH:mm:ss.000' );
        }


        if(h.name==="Subject"){
            obj["subject"]= h.value.toString().replace(/"/g, '\\"').replace(/'/g,"\\'")
        }
      })
      if(emailData.data.payload.parts){
        obj["body"]=gmailBodyPart(emailData.data.payload.parts);
        obj["body"]=Buffer.from( obj["body"],'base64').toString('ascii')

      }
      else{
        obj["body"] =Buffer.from(emailData.data.payload.body.data,'base64').toString('ascii')
      }
      //console.log(emailData.data.payload.parts[0].parts[0].parts[0])
      //obj["body"] = (emailData.data.payload.parts)?Buffer.from(emailData.data.payload.parts[0].body.data,'base64').toString('ascii'):Buffer.from(emailData.data.payload.body.data,'base64').toString('ascii');
      obj["body"] = obj["body"].replace(/"/g, '\\"').replace(/'/g,"\\'");
      if (obj["body"] === undefined) obj["body"]='NULL';

      obj["user_id"] = data.user_id;
      obj["status"] = "unread";
      
      //console.log("DATA",obj)

      //Inserting the mail data to the database by creating the query 
      let insertquery = `INSERT INTO inbox `;
      let insertqueryType = "insert";
      let generatedQuery = dbQueryUtilities.queryBuilder(insertqueryType, obj);
      insertquery = insertquery + generatedQuery;
    
      var queryResponse = await dbUtilities.createQuery(insertquery);
      //console.log("Query res", queryResponse);
      if (queryResponse.errorcode) {
        return queryResponse;
      }
  }
  return {success:true}
}
  catch(error){
    console.log(error);
  }

}

// function to get mail data from outlook mailbox and store it in the database
let storeOutlookMailData = async (accessToken,data,unreadMessagesID)=>{
  try{
    let x = unreadMessagesID;
    //console.log(accessToken)
    //console.log(x.length)
    for(let i=0;i<x.length;i++){
      // making an axios request to outlook api to get the mail data
      let emailData = await axios.get(
        ` https://graph.microsoft.com/v1.0/users/${data.emailAddress1}/messages/${x[i]}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Prefer: 'outlook.body-content-type="text"'
          },
        },
      );

      
      //console.log(emailData.data)
      // Creating a json object to structure the mail data returned from the request
      let obj = {
         email_id:emailData.data.id
        }
          obj["fromAddress"] = emailData.data.from.emailAddress.address;
          obj["toAddress"] = emailData.data.toRecipients[0].emailAddress.address;
          obj["createdAt"]= MOMENT(emailData.data.receivedDateTime).format( 'YYYY-MM-DD  HH:mm:ss.000' );
          obj["subject"]= emailData.data.subject.toString().replace(/"/g, '\\"').replace(/'/g,"\\'");
          obj["body"] = emailData.data.body.content.toString().replace(/"/g, '\\"').replace(/'/g,"\\'");
          if (obj["body"] === undefined) obj["body"]='NULL';
          obj["user_id"] = data.user_id;
          obj["status"] = "unread";
          //console.log("DATA",obj)

          //Inserting the mail data to the database by creating the query 
          let insertquery = `INSERT INTO inbox `;
          let insertqueryType = "insert";
          let generatedQuery = dbQueryUtilities.queryBuilder(insertqueryType, obj);
          insertquery = insertquery + generatedQuery;
          
          var queryResponse = await dbUtilities.createQuery(insertquery);
          console.log("Query res", queryResponse);
          if (queryResponse.errorcode) {
            return queryResponse;
          }
        }
  return {success:true}
}
  catch(error){
    console.log(error);
  }
}


let receiveEmail = async (data) =>{
    try{
        //console.log(data)

        // Getting a list of mail ids from the mailbox of gmail or outlook
        if(data.provider === "gmail"){
          // Using googleapi to generate access token using the refresh token
            oauth2Client.setCredentials({
                refresh_token: data.refreshToken
           });
           var accessToken = await oauth2Client.getAccessToken();
           var createdAtSeconds = MOMENT(data.createdAt, "YYYY-MM-DD HH:mm:ss.000").unix();
          //Making an axios request to get list of unread mail ids from the date when the user was created in the audiomailr application
          let unreadMessagesID = await axios.get( 
            ` https://gmail.googleapis.com/gmail/v1/users/${data.emailAddress1}/messages?q=in:unread after:${createdAtSeconds}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken.token}`,
              },
            },
          );

           //console.log(unreadMessagesID)
          
           //Calling getSavedUnreadMail to get unread mail list from database
          let selectQueryResponse= await getSavedUnreadMail(data);

          if(selectQueryResponse && selectQueryResponse.length>0){
            //IF MAIL ALREADY EXIST IN USER INBOX DB
            let inboxid = [];
            selectQueryResponse.forEach(id => inboxid.push(id.email_id));
            let unreadNewMessagesID = [];
            unreadMessagesID.data.messages.forEach(unread => unreadNewMessagesID.push(unread.id));

            // Comparing the unread mail ids with the ids received from the gmail api request 
            //  and selecting only the uread mail ids that doesnt exist in the database

            unreadNewMessagesID = unreadNewMessagesID.filter(val => !inboxid.includes(val));
            if(unreadNewMessagesID.length>0){
              // Storing the new unread mails
              let storeMail = storeGmailData(accessToken,data,unreadNewMessagesID);
              if(storeMail.errorcode){
              return storeMail
              }
              return storeMail;

            }
            else{
              //If no new unread mails just sending a boolean
              console.log("NO NEW MAILS RECEIVED YET")
              return {success:true}
            }
          }
          else{
            // New USER RECEIVEING MAIL FOR THE FIRST TIME

            let unreadNewMessagesID = [];
            //console.log(unreadMessagesID.data)
            if(unreadMessagesID.data.messages && unreadMessagesID.data.messages.length > 0) {
              unreadMessagesID.data.messages.forEach(unread => unreadNewMessagesID.push(unread.id))
              //console.log(unreadNewMessagesID)
              // Storing the new unread mails
              let storeMail = storeGmailData(accessToken,data,unreadNewMessagesID);
              if(storeMail.errorcode){
                return storeMail
              }
              return storeMail;
          }
          else{
            //If no new unread mails just sending a boolean
            return {success:true}
          }
            

             }
          }
          else if(data.provider === "outlook"){

            var createdAtDate = MOMENT(data.createdAt,'YYYY-MM-DD  HH:mm:ss.000').format("YYYY-MM-DD");
            //console.log(createdAtDate)
            //Making an axios request to get list of unread mail ids from the date when the user was created in the audiomailr application
            let unreadMessagesID = await axios.get(
              ` https://graph.microsoft.com/v1.0/users/${data.emailAddress1}/mailFolders/inbox/messages?$filter=isRead eq false and receivedDateTime ge ${createdAtDate}`,
              {
                headers: {
                  Authorization: `Bearer ${data.refreshToken}`,
                },
              },
            );
            
            //console.log(unreadMessagesID)
            //console.log(unreadMessagesID.data.value)

            //Calling getSavedUnreadMail to get unread mail list from database
             let selectQueryResponse= await getSavedUnreadMail(data);

             if(selectQueryResponse && selectQueryResponse.length>0){
              //IF MAIL EXIST IN USER INBOX DB
              let inboxid = [];
              selectQueryResponse.forEach(id => inboxid.push(id.email_id));
              let unreadNewMessagesID = [];
              unreadMessagesID.data.value.forEach(unread => unreadNewMessagesID.push(unread.id))

              // Comparing the unread mail ids with the ids received from the gmail api request 
              //  and selecting only the uread mail ids that doesnt exist in the database
              unreadNewMessagesID = unreadNewMessagesID.filter(val => !inboxid.includes(val));
              if(unreadNewMessagesID.length>0){
                // Storing the new unread mails
                let storeMail = storeOutlookMailData(data.refreshToken,data,unreadNewMessagesID);
                if(storeMail.errorcode){
                return storeMail
                }
                return storeMail;
              }
              else{
                //  No new unread mails
                //console.log("NO NEW MAILS RECEIVED YET")
                return {success:true}
              }
          }
          else{
            // New USER RECEIVEING MAIL FOR THE FIRST TIME
            let unreadNewMessagesID = [];
            if(unreadMessagesID.data.value.length > 0) {
            unreadMessagesID.data.value.forEach(unread => unreadNewMessagesID.push(unread.id))
            //console.log(unreadNewMessagesID)
            // Storing the new unread mails
            let storeMail = storeOutlookMailData(data.refreshToken,data,unreadNewMessagesID);
            if(storeMail.errorcode){
              return storeMail
            }
            return storeMail;
          }
          else{
            return {success:true}
          }
          

             }
        }
      }
    catch(error){
      console.log(error)
    }
}



// Handler to receive the email and storing the data in the database
let receiveMailHandler = async (req,res)=>{
    //console.log(req.decodedData)

    //Calling to receiveEmail funtion to receive new unread emails and then storing them in the database
    var receiveEmailResponse = await receiveEmail(req.decodedData);
    if(receiveEmailResponse.errorcode) return res.json(receiveEmailResponse);
    if(receiveEmailResponse.success === true){
      // Calling the getInboxEmail to get all the mails stored in the database after receiving them
      var getinboxmail = await getInboxEmail(req.decodedData,req.body);
      return res.json(getinboxmail);
    }

}


module.exports = receiveMailHandler;
