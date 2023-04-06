
const dbQueryUtilities = require("../utilities/dbQueryUtilities");
const dbUtilities = require("../utilities/dbUtilities");

let getSentEmail = ()=>{
try{

}
catch(error){

}

}

let getInboxEmail = async (data,bodyData) =>{
    try{
        let pagenumber = 0;
        if(bodyData.pagenumber){
            pagenumber= body.pagenumber;
        }
        var getMailData = {
            conditionData: {
              toAddress: data.emailAddress1,
            },
            limitConditon:{
                startRoW:pagenumber*15,
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
    
};
