"use strict"
const mysql = require('mysql');
const crypto = require('crypto');
// 载入模块
const Segment = require('segment');
// 创建实例
var segment = new Segment();
// 使用默认的识别模块及字典，载入字典文件需要1秒，仅初始化时执行一次即可
segment.useDefault();

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'luluo_db'
});
conn.connect();

var keywords = '水彩 素描';

var result = segment.doSegment(keywords, {
  stripStopword: true,
  simple: true,
  stripPunctuation: true
});

var redis = require("redis"),
    client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});

result = result.map(val => {
  let md5 = crypto.createHash('md5');
  md5.update(val);
  val = md5.digest('hex');
  return `w:${val}`
})

// console.log(result);

client.sinter(result, (err, replies) => {
    // console.log(err, replies);
    conn.query('select * from goods where id in (' + replies.join(',') + ') limit 10', (err, rows) => {
        console.log(rows);
    });
})