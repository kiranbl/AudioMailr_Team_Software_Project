var jwt = require('jsonwebtoken');


var generateJWT = async (data)=>{
try{
    var privateKey = "AUDIOMAILR123123123"
    jwt.sign(data, privateKey, { algorithm: 'RS256' }, (err, token) =>{
        if(err) throw err;
            return token;
        });
}
catch(err){
    return(err)
}
   
}

var verifyJWT = async (token)=>{
    try{
        var privateKey = "AUDIOMAILR123123123"
        jwt.verify(token, privateKey, (err, decoded) =>{
            if(err) throw err;
            return (decoded);
          });
    }
    catch(err){
        console.log("JWTVerifyError ===>>>",err)
        return({"statusCode":403,"message":"Forbidden route"});
    }
       
    }



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
      if(data.statusCode){
        res.json(data);
      }
      else{
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