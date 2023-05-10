var jwt = require('jsonwebtoken');

var authenticationErrorCode = (statusCode)=>{
  switch (statusCode){
      case 4000: return ({"errorcode":statusCode,"message": "JWT Generation Failed"});
      case 4001: return ({"errorcode":statusCode,"message": "Invalid JWT"});
      case 4002: return ({"errorcode":statusCode,"message": "Invalid Password, Should be minimum 8 character"});
  }
}

//Function to gentate JWT with payload as data containg user data
var generateJWT = async (data)=>{
try{
    var privateKey = process.env.JWT_SECRET
    var token = jwt.sign(data, privateKey);
    return token;
}
catch(err){
    console.log("JWT Error",err);
    return(authenticationErrorCode(4000))
}
   
}

//Function to VERIFY JWT 
var verifyJWT = async (token)=>{
    try{
        var privateKey = process.env.JWT_SECRET
        var decodedData = jwt.verify(token, privateKey);
        return decodedData;
      }
    catch(err){

      console.log("JWTVerifyError",err);
      return(authenticationErrorCode(4001));
    }
       
    }


// Handler to check the request headers to check for the token in the headers and verify the token
var authHandler = async (req,res,next)=>{

    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
    
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      var data = await verifyJWT(req.token);
      if(data.errorcode){
        res.json(data);
      }
      else{
        console.log(data);
        req["decodedData"]= data;
        next();
      }

    } else {
      // Forbidden
      res.json({"statusCode":403,"message":"Forbidden route"});
    }



}



module.exports={
    authHandler,
    generateJWT,
    verifyJWT
}