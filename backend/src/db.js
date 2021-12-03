var mysql = require('mysql2');

function execute_query(query){
    return new Promise(resolve =>  {
        try{
            var connection = mysql.createConnection({
                host     : process.env.SQL_HOST,
                user     : process.env.SQL_USER,
                password : process.env.SQL_PASSWORD,
                database : process.env.SQL_DB,
              });
               
              connection.connect();
               
              connection.query(query, function (error, results, fields) {
                    if (error) throw error;
                    //console.log(results);
                    //console.log(fields)
                    resolve(results);
              });
        }catch(e){
            resolve(e);
        }finally{
           connection.end();
        }
    })
    
}

module.exports = {
    execute_query
}

 
