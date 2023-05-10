const getMailUtilities = require("./getMailUtilities");

// Handler to get the sent email data stored in the database
let sentMailHandler =async (req,res)=>{
    console.log(req.decodedData)
    let sentEmailResponse = await getMailUtilities.getSentEmail(req.decodedData,req.body);
    return res.json(sentEmailResponse);
  
}

module.exports = {
    sentMailHandler
}
