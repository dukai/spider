"use strict"
const mysql = require('mysql');
const crypto = require('crypto');
// const nodejieba = require("nodejieba");
const TOP_N = 40;
// 载入模块
var Segment = require('segment');
// 创建实例
var segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();

var redis = require("redis"),
    client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'luluo_db'
});
conn.connect();

const TAKE_COUNT = 100;

var getDataPage = function(start){
    return new Promise(function(resolve, reject){
        conn.query(`select * from goods limit ${start}, ${TAKE_COUNT}`, (err, rows, fields) => {
            if(err){
                reject(err);
            }else{
                resolve(rows);
            }
        });
    })
}

var pointer = 0;



var readPage = function(){

    getDataPage(pointer * TAKE_COUNT).then(rows => {
        rows.forEach(row => {
            // console.log(nodejieba.extract(row.title, TOP_N));
            var result = segment.doSegment(row.title, {
                stripStopword: true,
                simple: true,
                stripPunctuation: true
            });
            console.log(row.title, result);
            for(let val of result){
                var md5 = crypto.createHash('md5');
                md5.update(val);
                var key = md5.digest('hex');
                console.log(key);
                client.sadd('w:' + key, row.id, (err) => {
                    if(err){
                        console.log(err);
                    }
                });
            }
        });

        pointer++;
        readPage();
    })
}

readPage();