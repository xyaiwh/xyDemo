// const request= require('request')
const http = require('http')
const path= require('path')
const fs = require('fs');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
// const superAgent = require('superagent');


const url='http://book.zongheng.com/chapter/685640/38883752.html';
let page=1,
    lastPage=30;

function downLoad(url) {
   http.get(url,(res)=>{
    //    console.log(res);
       var html='';
       res.on('data',(chunk)=>{
        //    console.log(chuck);
           html+=chunk.toString('utf-8')
       })
       res.on('end',()=>{
        //    //把获取到的buffer数据转码成gbk格式
        // const html1 = iconv.decode(Buffer.concat(html), 'GBK');
        const $ = cheerio.load(html, {decodeEntities: false});
        // console.log($,html1);
        const title=$('.title .title_txtbox').text();
        const bookName=$('.reader_crumb a').eq(2).text();
        let content=$('.content').html().split('</p><p>');
         content[0]=content[0].split('<p>')[1];
         content[content.length-1]=content[content.length-1].split('</p>')[0];
        console.log(title,bookName);
        let bookObj={
            id:page,
            err:0,
            bookName:bookName,
            title:title,
            content:content
        };
        saveContent(bookObj);
        // console.log(html);
       })
   })
        
}
function saveContent(obj) {
    console.log(`${page}--${obj.title}`);
    const fileName=path.join(__dirname,`data/${obj.bookName}`);
    console.log(fileName);
     //判断书名文件夹是否存在，不存在则创建
    if (!fs.existsSync(fileName)) {
         fs.mkdirSync(fileName, {recursive:true},(err)=>{
             if (err) console.log(err);
             console.log('数据写入成功');
         })
     }
    //写入json文件
     fs.writeFile(`./data/${obj.bookName}/chapter${page}.json`, JSON.stringify(obj), 'utf-8', err => {
        if (err) throw err
     })
 }
downLoad(url);
