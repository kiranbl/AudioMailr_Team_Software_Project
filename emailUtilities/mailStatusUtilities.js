
const dbQueryUtilities = require("../utilities/dbQueryUtilities");
const dbUtilities = require("../utilities/dbUtilities");
let validator = require("../utilities/validationUtilities")

var setMailStatusErrorCode = (statusCode) => {
    switch (statusCode) {
        case 7001:
        return { errorcode: statusCode, message: `Mail Read` };
    }
  };

// function to set the mail status from unread to read
let setMailStatus =async (data,emailStatus)=>{
try{
    
      let updateQuery = `UPDATE `;
      var getMailData = {
        updationData: {
            status: "read",
        },
        conditionData: {
            user_id: data.user_id,
            email_id:emailStatus.mail_id
        },
        tablename: "inbox",
      };

      let generatedUpdateQuery = dbQueryUtilities.queryBuilder("update", getMailData);
      updateQuery = updateQuery + generatedUpdateQuery;
      //console.log(updateQuery)
      var updateQueryResponse = await dbUtilities.updateQuery(updateQuery);
      //console.log("Update Query res", updateQueryResponse);
      return updateQueryResponse;
    }

catch(error){
console.log(error)
}

}


// Handler to set the email status and update the database
let setMailStatusHandler = async (req,res)=>{
    //console.log(req.body)
    if (!Object.keys(req.body).length) {
        return res.status(400).json({
          statusCode: 400,
          message: "Content can not be empty!",
        });
  }else {
    // validating the body data by calling mailStatusValidator from validator utilities
    var validatorResponse = validator.mailStatusValidator(req.body);
    if (validatorResponse) {
      return res.json(validatorResponse);
    }
    var emailStatus = {
      mail_id: req.body.mailid
    };
    
    // calling the setMailStatus function to change the mail status
    var setMailResponse = await setMailStatus(req.decodedData,emailStatus);
    if(setMailResponse.errorcode) return (setMailResponse)
    return res.json(setMailStatusErrorCode(7001));
  }

}

module.exports =  setMailStatusHandler ;
