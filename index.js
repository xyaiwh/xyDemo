// const request= require('request')
const http = require('http')
const path= require('path')
const fs = require('fs');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const { insert } =require( './mysql/index');
// const superAgent = require('superagent');


const url='http://book.zongheng.com/chapter/685640/38883752.html';
let page=1,
    lastPage=89;
let bookName1='',
    bookArr=[];
// console.log(insert);
/* let sql=' INSERT INTO bookdesc(id,errCode,bookName,title,content) value(?,?,?,?,?)';
async function getData(sql){
    console.log(3333);
    let result = await insert(sql,bookArr);
    console.log(result);
} */




function downLoad(url) {
   http.get(url,(res)=>{
    //    console.log(res);
       var html='';
       res.on('data',(chunk)=>{
        //    console.log(chuck);
           html+=chunk.toString('utf-8')
       });
       res.on('end',()=>{
        //    //把获取到的buffer数据转码成gbk格式
        // const html1 = iconv.decode(Buffer.concat(html), 'GBK');
        const $ = cheerio.load(html, {decodeEntities: false});
        // console.log($,html1);
        const title=$('.title .title_txtbox').text();
        const bookName=$('.reader_crumb a').eq(2).text();
        let content=$('.content').html();
        // console.log(title,bookName);
        let id1='';
        for(let num=0;num<6;num++){
            id1+=Math.floor(Math.random()*10) ;
        }
        id1=Number(id1);
        console.log(Number(id1));
        let bookObj={
            id:id1,
            pageId:page,
            errCode:0,
            bookName:bookName,
            title:title,
            content:content
        };
        bookName1=bookObj.bookName;
        bookArr.push(bookObj);
        // console.log(bookArr);
        saveContent(bookName1)
        let nextLink=$('.chap_btnbox a').eq(2).attr('href');
        // console.log(nextLink);
        page++;
        if(page<=lastPage){
            setTimeout(()=>{
                downLoad(nextLink);
            },500)
        }
        console.log(22222);
        
        // console.log(html);
       });
       
   });
   
   
}
downLoad(url);
function saveContent(bookName) {
    const fileName=path.join(__dirname,`data/${bookName}`);
    console.log(fileName);
     //判断书名文件夹是否存在，不存在则创建
    if (!fs.existsSync(fileName)) {
         fs.mkdirSync(fileName, {recursive:true},(err)=>{
             if (err) console.log(err);
             console.log('数据写入成功');
         })
     }
    //写入json文件
     fs.writeFile(`./data/${bookName}/chapter.json`, JSON.stringify(bookArr), 'utf-8', err => {
        if (err) throw err
     });
     console.log(11111);
 }

