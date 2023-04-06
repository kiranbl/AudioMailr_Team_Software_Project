const  { google } = require('googleapis');
const axios = require("axios");
const MOMENT= require( 'moment' );
const dbQueryUtilities = require("../utilities/dbQueryUtilities");
const dbUtilities = require("../utilities/dbUtilities");
const {getInboxEmail} = require("./getMailUtilities")

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI

);

let storegmailData = async (accessToken,data,unreadMessagesID)=>{
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
        
        console.log(emailData.data.payload.headers)
      let obj = {
         email_id:x[i]
        }

      emailData.data.payload.headers.forEach(h =>{

        if(h.name==="From" && h.value.includes("<")){
          console.log(h.name)
          let from =h.value.split(" <");
          from = from[1].substr(0,from[1].length-1)
          
          obj["fromAddress"] = from;
        }
        else if(h.name==="From"){
          obj["fromAddress"] = h.value;
        }
        if(h.name==="To" && h.value.includes("<")){ 
          console.log(h.name)
        let to =h.value.split(" <");
        to = to[1].substr(0,to[1].length-1)
        
        obj["toAddress"] = to;
        }
        else if(h.name==="To"){
          obj["toAddress"] = h.value;
        }

        
        if(h.name==="Date"){
            obj["createdAt"]= MOMENT(h.value).format( 'YYYY-MM-DD  HH:mm:ss.000' );
        }


        if(h.name==="Subject"){
            obj["subject"]= h.value
        }
      })

      obj["body"] = Buffer.from(Array.isArray(emailData.data.payload)?emailData.data.payload.parts[0].body.data:emailData.data.payload.body.data ,'base64').toString('ascii');

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

let receiveEmail = async (data) =>{
    try{
        console.log(data)
        if(data.provider === "gmail"){
            oauth2Client.setCredentials({
                refresh_token: data.refreshToken
           });
           var accessToken = await oauth2Client.getAccessToken();
        
          let unreadMessagesID = await axios.get(
            ` https://gmail.googleapis.com/gmail/v1/users/${data.emailAddress1}/messages?labelIds=UNREAD`,
            {
              headers: {
                Authorization: `Bearer ${accessToken.token}`,
              },
            },
          );

          
          
          var existingemailids = {
            conditionData: {
              toAddress: data.emailAddress1,
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

          

          if(selectQueryResponse && selectQueryResponse.length>0){
            //IF MAIL EXIST IN USER INBOX DB
            let inboxid = [];
            selectQueryResponse.forEach(id => inboxid.push(id.email_id));

            let unreadNewMessagesID = [];
            unreadMessagesID.data.messages.forEach(unread => unreadNewMessagesID.push(unread.id))

            unreadNewMessagesID = unreadNewMessagesID.filter(val => !inboxid.includes(val));

            if(unreadNewMessagesID.length>0){
              //new unread emails
              let storeMail = storegmailData(accessToken,data,unreadNewMessagesID);
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
            unreadMessagesID.data.messages.forEach(unread => unreadNewMessagesID.push(unread.id))
            let storeMail = storegmailData(accessToken,data,unreadNewMessagesID);
            if(storeMail.errorcode){
              return storeMail
            }
            return storeMail;

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
