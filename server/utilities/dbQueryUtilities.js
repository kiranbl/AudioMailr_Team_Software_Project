// queryBuilder function is defined to generate a dynamic mysql query based on the rules, data and querytype sent in the parameters
var queryBuilder = (queryType,data)=>{
    
    // Generating insert query 
    if(queryType === "insert"){

        var dataArray = Object.keys(data);
        var key='';
        var value='';
        for(var i=0; i<dataArray.length;i++){
            if(i === dataArray.length-1){
                key += `${dataArray[i]} `;
                value += `'${data[dataArray[i]]}' `
            }else{
                key += `${dataArray[i]}, `;
                value += `'${data[dataArray[i]]}', `
            }
        }
        
        var query = `(${key}) VALUES ( ${value})`;
        //console.log("INSERT QUERY ===>>> ",query);
        return query;
    }
    // Generating select query
    if(queryType === "select"){

        var dataArray = Object.keys(data.conditionData);
        var conditionType = data.conditionType? data.conditionType:"AND";
        var selectionQuery = "";
        var conditionQuery="";
        if(data.selectionData){
            for(var i=0; i<data.selectionData.length;i++){
                if(i === data.selectionData.length-1){
                    selectionQuery = selectionQuery + ` ${data.selectionData[i]}`
                }else{
                    selectionQuery = selectionQuery + ` ${data.selectionData[i]},`
                }
            }
        }
        else{
            selectionQuery = selectionQuery + "*"
        }
        if(dataArray.length>1){
            for(var i=0; i<dataArray.length;i++){
                if(i === dataArray.length-1){
                    conditionQuery = conditionQuery + `${dataArray[i]} = "${data.conditionData[dataArray[i]]}"`
                }else{
                    conditionQuery = conditionQuery + `(${dataArray[i]} = "${data.conditionData[dataArray[i]]}" ${conditionType} `
                }
            }
        }
        else{
            conditionQuery = conditionQuery + `(${dataArray[0]} = "${data.conditionData[dataArray[0]]}"`
        }

        let orderQuery="";
        if(data.orderCondition){
            orderQuery = orderQuery+"ORDER BY " + `${data.orderCondition.orderby} ${data.orderCondition.condition}`;
        }


        let limitQuery="";
        if(data.limitCondition){
            //console.log("limit")
            limitQuery = limitQuery+"LIMIT " + `${data.limitCondition.startRow}, ${data.limitCondition.count}`;
        }
      
        
        var query = `${selectionQuery} FROM ${data.tablename} WHERE ${conditionQuery}) ${orderQuery} ${limitQuery}`;
        //console.log("SELECT QUERY ===>>> ",query);
        return query;
    }
    // Generating update query
    if(queryType ==="update"){
        //console.log(data)
        var updateDataArray =  Object.keys(data.updationData);
        var dataArray = Object.keys(data.conditionData);
        var conditionType = data.conditionType? data.conditionType:"AND";
        var updationQuery = "";
        var conditionQuery="";
        if(data.updationData){
            for(var i=0; i<updateDataArray.length;i++){
                if(i === updateDataArray.length-1){
                    updationQuery = updationQuery + `${updateDataArray[i]} = "${data.updationData[updateDataArray[i]]}" `
                }else{
                    updationQuery = updationQuery + `${updateDataArray[i]} = "${data.updationData[updateDataArray[i]]}" ,`
                }
            }
        }

        if(dataArray.length>1){
            for(var i=0; i<dataArray.length;i++){
                if(i === dataArray.length-1){
                    conditionQuery = conditionQuery + `${dataArray[i]} = "${data.conditionData[dataArray[i]]}"`
                }else{
                    conditionQuery = conditionQuery + `${dataArray[i]} = "${data.conditionData[dataArray[i]]}" ${conditionType} `
                }
            }
        }
        else{
            conditionQuery = conditionQuery + `${dataArray[0]} = "${data.conditionData[dataArray[0]]}"`
        }
        
        var query = `${data.tablename} SET ${updationQuery} WHERE ${conditionQuery} `;
        //console.log("UPDATE QUERY ===>>> ",query);
        return query;

    }


}


module.exports={
    queryBuilder
}