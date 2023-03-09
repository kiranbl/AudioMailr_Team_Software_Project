var pool = require("../config/dbconfig.js");


var selectAllQuery = (query)=>{
try{
    pool.getConnection(function(err, conn) {
        // Do something with the connection
        conn.query(query,  (error, results, fields)=>{
        if(error) throw error;
        console.log(results);
        pool.releaseConnection(conn);
        });
        
     })
}
catch(error){
    return error;
}
    


} 
 

module.exports={
    selectAllQuery
}