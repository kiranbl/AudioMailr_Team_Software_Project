
const dbQueryUtilities = require("../utilities/dbQueryUtilities");
const dbUtilities = require("../utilities/dbUtilities");

// function to get the sent mail data from database 
let getSentEmail =async (data,bodyData)=>{
try{
    // for pagination which is not implemented yet
    let pagenumber = 0;
    if(bodyData.pagenumber){
        pagenumber= body.pagenumber;
    }
    var getMailData = {
        conditionData: {
            user_id: data.user_id,
        },
        limitCondition:{
            startRow:pagenumber*15,
            count:15
        },
        orderCondition:{
            orderby:"createdAt",
            condition:"DESC"
        },
        tablename: "sent",
      };
  
      let selectQuery = `Select `;
      let generatedSelectQuery = dbQueryUtilities.queryBuilder("select", getMailData);
      selectQuery = selectQuery + generatedSelectQuery;
  
      var selectQueryResponse = await dbUtilities.selectQuery(selectQuery);
      console.log("Select Query res", selectQueryResponse);
      return selectQueryResponse;
    }

catch(error){
console.log(error)
}

}

// function to get the inbox mail data from database
let getInboxEmail = async (data,bodyData) =>{
    try{
        
        // for pagination which is not implemented yet
        let pagenumber = 0;
        if(bodyData.pagenumber){
            pagenumber= body.pagenumber;
        }
        var getMailData = {
            conditionData: {
                user_id: data.user_id,
            },
            limitCondition:{
                startRow:pagenumber*15,
                count:15
            },
            orderCondition:{
                orderby:"createdAt",
                condition:"DESC"
            },
            tablename: "inbox",
          };
      
          let selectQuery = `Select `;
          let generatedSelectQuery = dbQueryUtilities.queryBuilder("select", getMailData);
          selectQuery = selectQuery + generatedSelectQuery;
      
          var selectQueryResponse = await dbUtilities.selectQuery(selectQuery);
          console.log("Select Query res", selectQueryResponse);
          return selectQueryResponse;
        }
    catch(error){
      console.log(error)
    }
   
}



module.exports = {
    getInboxEmail,
    getSentEmail
}
