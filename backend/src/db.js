var mysql = require('mysql2');

var pool = mysql.createPool({
    connectionLimit: 10,
    host     : process.env.SQL_HOST,
    user     : process.env.SQL_USER,
    password : process.env.SQL_PASSWORD,
    database : process.env.SQL_DB,
  });

function execute_query(query){
    return new Promise(resolve =>  {
        try{   
              pool.query(query, function (error, results, fields) {
                    if (error) throw error;
                    //console.log(results);
                    //console.log(fields)
                    resolve(results);
              });
        }catch(e){
            resolve(e);
        }
    })
    
}

module.exports = {
    execute_query,
    pool
}

 
