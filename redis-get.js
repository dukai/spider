const mysql = require('mysql');
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'luluo_db'
});
conn.connect();

var redis = require("redis"),
    client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});

client.smembers('w:49f68a5c8493ec2c0bf489821c21fc3b',(err, replies) => {
    console.log(err, replies);
    conn.query('select * from goods where id in (' + replies.join(',') + ')', (err, rows) => {
        console.log(rows);
    });
})