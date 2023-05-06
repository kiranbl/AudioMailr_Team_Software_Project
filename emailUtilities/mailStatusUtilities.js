
const dbQueryUtilities = require("../utilities/dbQueryUtilities");
const dbUtilities = require("../utilities/dbUtilities");
let validator = require("../utilities/validationUtilities")

var serMailStatusErrorCode = (statusCode) => {
    switch (statusCode) {
        case 7001:
        return { errorcode: statusCode, message: `Mail Read` };
    }
  };

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
      console.log(updateQuery)
      var updateQueryResponse = await dbUtilities.updateQuery(updateQuery);
      console.log("Update Query res", updateQueryResponse);
      return updateQueryResponse;
    }

catch(error){
console.log(error)
}

}



let setMailStatusHandler = async (req,res)=>{
    console.log(req.decodedData)
    if (!req.body) {
        res.status(400).json({
          statusCode: 400,
          message: "Content can not be empty!",
        });
  }else {
    var validatorResponse = validator.mailStatusValidator(req.body);
    if (validatorResponse) {
      return res.json(validatorResponse);
    }
    var emailStatus = {
      mail_id: req.body.mailid
    };
    
    
    var setMailResponse = await setMailStatus(req.decodedData,emailStatus);
    if(setMailResponse.errorcode) return (setMailResponse)
    return res.json(serMailStatusErrorCode(7001));
  }

}

module.exports =  setMailStatusHandler ;
