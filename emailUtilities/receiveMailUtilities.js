const  { google } = require('googleapis');
const axios = require("axios");
const MOMENT= require( 'moment' );
const dbQueryUtilities = require("../utilities/dbQueryUtilities");
const dbUtilities = require("../utilities/dbUtilities");
const {getInboxEmail} = require("./getMailUtilities")


var receiveMailErrorCode = (statusCode) => {
  switch (statusCode) {
      case 7001:
      return { errorcode: statusCode, message: `Authorization Expired, Login Again` };
  }
}; 

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI

);

let getSavedUnreadMail =async (data)=>{

  var existingemailids = {
    conditionData: {
     user_id: data.user_id,
    },
    conditionType: 'OR',
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

let storeGmailData = async (accessToken,data,unreadMessagesID)=>{
  try{
    console.log(data)
    console.log(unreadMessagesID)
    let x = unreadMessagesID;

    console.log(x.length)
    for(let i=0;i<x.length;i++){


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
        console.log(emailData)
        
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

      obj["body"] = (emailData.data.payload.parts)?emailData.data.payload.parts[0].body.data:emailData.data.payload.body.data;
      if (obj["body"] === undefined) obj["body"]='NULL';

      obj["user_id"] = data.user_id;
      obj["status"] = "unread";
      console.log("DATA",obj)

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

let storeOutlookMailData = async (accessToken,data,unreadMessagesID)=>{
  try{
    let x = unreadMessagesID;
    console.log(accessToken)
    console.log(x.length)
    for(let i=0;i<x.length;i++){

      let emailData = await axios.get(
        ` https://graph.microsoft.com/v1.0/users/${data.emailAddress1}/messages/${x[i]}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      
      //console.log(emailData.data)
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
         // console.log("DATA",obj)

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
        console.log(data)
        if(data.provider === "gmail"){
            oauth2Client.setCredentials({
                refresh_token: data.refreshToken
           });
           var accessToken = await oauth2Client.getAccessToken();
           var createdAtSeconds = MOMENT(data.createdAt, "YYYY-MM-DD HH:mm:ss.000").unix();
          let unreadMessagesID = await axios.get( 
            ` https://gmail.googleapis.com/gmail/v1/users/${data.emailAddress1}/messages?q=in:unread after:${createdAtSeconds}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken.token}`,
              },
            },
          );

           console.log(unreadMessagesID)
          
          let selectQueryResponse= await getSavedUnreadMail(data);

          if(selectQueryResponse && selectQueryResponse.length>0){
            //IF MAIL EXIST IN USER INBOX DB
            let inboxid = [];
            selectQueryResponse.forEach(id => inboxid.push(id.email_id));

            let unreadNewMessagesID = [];
            unreadMessagesID.data.messages.forEach(unread => unreadNewMessagesID.push(unread.id))

            unreadNewMessagesID = unreadNewMessagesID.filter(val => !inboxid.includes(val));

          
            if(unreadNewMessagesID.length>0){
              //new unread emails
              let storeMail = storeGmailData(accessToken,data,unreadNewMessagesID);
              if(storeMail.errorcode){
              return storeMail
              }
              return storeMail;

            }
            else{
              //no new unread mails
              console.log("NO NEW MAILS RECEIVED YET")
              return {success:true}
            }
          }
          else{
            // New USER RECEIVEING MAIL FOR THE FIRST TIME

            // {
            //   messages: [ { id: '187e652dc820e489', threadId: '187e652dc820e489' } ],
            //   resultSizeEstimate: 1
            // }
            let unreadNewMessagesID = [];
            console.log(unreadMessagesID.data)
            if(unreadMessagesID.data.messages && unreadMessagesID.data.messages.length > 0) {
              unreadMessagesID.data.messages.forEach(unread => unreadNewMessagesID.push(unread.id))
              console.log(unreadNewMessagesID)
              let storeMail = storeGmailData(accessToken,data,unreadNewMessagesID);
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
          else if(data.provider === "outlook"){

            var createdAtDate = MOMENT(data.createdAt,'YYYY-MM-DD  HH:mm:ss.000').format("YYYY-MM-DD");
            console.log(createdAtDate)
            let unreadMessagesID = await axios.get(
              ` https://graph.microsoft.com/v1.0/users/${data.emailAddress1}/mailFolders/inbox/messages?$filter=isRead eq false and receivedDateTime ge ${createdAtDate}`,
              {
                headers: {
                  Authorization: `Bearer ${data.refreshToken}`,
                },
              },
            );
            
            console.log(unreadMessagesID)
            

             console.log(unreadMessagesID.data.value)

             let selectQueryResponse= await getSavedUnreadMail(data);

             if(selectQueryResponse && selectQueryResponse.length>0){
              //IF MAIL EXIST IN USER INBOX DB
              let inboxid = [];
              selectQueryResponse.forEach(id => inboxid.push(id.email_id));
  
              let unreadNewMessagesID = [];
              unreadMessagesID.data.value.forEach(unread => unreadNewMessagesID.push(unread.id))
  
              unreadNewMessagesID = unreadNewMessagesID.filter(val => !inboxid.includes(val));
  
            
              if(unreadNewMessagesID.length>0){
                //new unread emails
                let storeMail = storeOutlookMailData(data.refreshToken,data,unreadNewMessagesID);
                if(storeMail.errorcode){
                return storeMail
                }
                return storeMail;
  
              }
              else{
                //no new unread mails
                console.log("NO NEW MAILS RECEIVED YET")
                return {success:true}
              }
          }
          else{
            // New USER RECEIVEING MAIL FOR THE FIRST TIME
            let unreadNewMessagesID = [];
            if(unreadMessagesID.data.value.length > 0) {
            unreadMessagesID.data.value.forEach(unread => unreadNewMessagesID.push(unread.id))
            console.log(unreadNewMessagesID)
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




  let receiveMailHandler = async (req,res)=>{
    console.log(req.decodedData)

    var receiveEmailResponse = await receiveEmail(req.decodedData);
    if(receiveEmailResponse.errorcode) return res.json(receiveEmailResponse);
    
    if(receiveEmailResponse.success === true){
      var getinboxmail = await getInboxEmail(req.decodedData,req.body);
      return res.json(getinboxmail);
    }

}


module.exports =receiveMailHandler;
