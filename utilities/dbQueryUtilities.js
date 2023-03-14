var queryBuilder = (queryType,data)=>{
    
    if(queryType === "insert"){

        var dataArray = Object.keys(data);
        var key="";
        var value="";
        for(var i=0; i<dataArray.length;i++){
            if(i === dataArray.length-1){
                key += `${dataArray[i]} `;
                value += `"${data[dataArray[i]]}" `
            }else{
                key += `${dataArray[i]}, `;
                value += `"${data[dataArray[i]]}", `
            }
        }
        
        var query = `(${key}) VALUES ( ${value})`;
        console.log("INSERT QUERY ===>>> ",query);
        return query;
    }

    if(queryType === "select"){

        var dataArray = Object.keys(data.conditionData);
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
                    conditionQuery = conditionQuery + `${dataArray[i]} = "${data.conditionData[dataArray[i]]}" AND `
                }
            }
        }
        else{
            conditionQuery = conditionQuery + `${dataArray[i]} = "${data.conditionData[dataArray[i]]}"`
        }
      
        
        var query = `${selectionQuery} FROM ${data.tablename} WHERE ${conditionQuery})`;
        console.log("SELECT QUERY ===>>> ",query);
        return query;
    }


}


module.exports={
    queryBuilder
}