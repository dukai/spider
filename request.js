const querystring = require('querystring');
const http = require('http');


var options = {
  hostname: '30.96.76.170',
  port: 8090,
  path: '/add',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};


module.exports = function(data){

  return new Promise(function(resolve, reject){

    var postData = JSON.stringify(data);
    console.log(postData);

    options.headers['Content-Length'] = Buffer.byteLength(postData);

    var req = http.request(options, (res) => {
      // console.log(`STATUS: ${res.statusCode}`);
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      var result = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        result += chunk;
      });
      res.on('end', () => {
        resolve(result);
      })
    });

    req.on('error', (e) => {
      reject(e);
    });

    // write data to request body
    req.write(postData);
    req.end();
  });
}