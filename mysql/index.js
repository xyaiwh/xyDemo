const fs = require('fs');
const path = require('path');
const mysql= require('mysql');
const { resolve } = require('path');

const mysqlConn=mysql.createConnection({
    host: '120.78.183.171',
    port: 3306,
    user: 'new_youmeijituan',
    password:'Aorise@youmeijituan',
    database: 'book'
});

mysqlConn.connect();



const data=fs.readFileSync('E:\\vueProject\\nodejs\\demo\\xyDemo\\data\\元尊\\chapter.json');
const jsonObj=JSON.parse(data);

// console.log(jsonObj,insert);
function insert(sql,params){
    console.log(params);
    return new Promise((resolve,reject)=>{
        mysqlConn.query(sql,params, function(err,results){
            if (err) {
                console.log(err);
                reject(err);
            }else{
                
                let res=JSON.stringify(results);
                results=JSON.parse(res);
                resolve(results)
            }
        });
        console.log('insert is complated');
    })
}



(async ()=>{
    
    for(let w of jsonObj){
        console.log(w);
        let sql=`INSERT INTO bookdesc(id,pageId,errCode,bookName,title,content) value(?,?,?,?,?,?)`;
        let params=[w.id,w.pageId,w.errCode,w.bookName,w.title,w.content];
        await insert(sql,params);
    }
})()