"use strict"
const mysql = require('mysql');
const crypto = require('crypto');
// const nodejieba = require("nodejieba");
const TOP_N = 40;

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
          conn.query(`update goods set low_price='${row.price}' where id=${row.id}`);
        });

        pointer++;
        readPage();
    })
}

readPage();
