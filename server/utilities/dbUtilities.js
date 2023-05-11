// Getting the pool connection
const pool = require("../config/dbconfig");

var databaseErrorCode = (statusCode)=>{
    switch (statusCode){
        case 3000: return ({"errorcode":statusCode,"message": "Not Found"});
        case 3001: return ({"errorcode":statusCode,"message": "Creation Failed"});
        case 3002: return ({"errorcode":statusCode,"message": "Invalid Password, Should be minimum 8 character"});
        case 3003: return ({"errorcode":statusCode,"message": "Updation Failed"});
    }
}

// Running the selet query and returning the data
var selectQuery = async (query)=>{
try{
    var [rows,fields] = await pool.query(query);
    //console.log(rows)
    //console.log(fields);
    return rows;
//     pool.getConnection((err,connection)=>{
//         if(err) throw err;
//     connection.query(query,(error, results, fields)=>{
//         if(error) throw error;
//         connection.release();
//     });
// });
    
}
catch(error){
    console.log("Create Query Error",error)
    if (error) console.log(error); return(databaseErrorCode(3001));

}

} 

// Running the insert query and returning the data
var createQuery =async (query)=>{
    try{
        
        var [rows,fields] = await pool.query(query);
        //console.log(rows)
        //console.log(fields);
        return rows;
    //     pool.getConnection((err,connection)=>{
    //         if(err) throw err;
    //     connection.query(query,(error, results, fields)=>{
    //         if(error) throw error;
    //         connection.release();
    //     });
    // });
        
    }
    catch(error){
        console.log("Create Query Error",error)
        if (error) return(databaseErrorCode(3001));

    }
 
    
  }
  
// Running the update query and returning the data
var updateQuery =async (query)=>{
    try{
        
        var [rows,fields] = await pool.query(query);
        //console.log(rows)
        //console.log(fields);
        return rows;
    //     pool.getConnection((err,connection)=>{
    //         if(err) throw err;
    //     connection.query(query,(error, results, fields)=>{
    //         if(error) throw error;
    //         connection.release();
    //     });
    // });
        
    }
    catch(error){
        console.log("Update Query Error",error)
        if (error) return(databaseErrorCode(3003));

    }
 
    
}
 
 

module.exports={
    selectQuery,
    createQuery,
    updateQuery
}