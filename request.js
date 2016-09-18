const querystring = require('querystring');
const http = require('http');


var options = {
  hostname: 'api.90jian.com',
  port: 80,
  path: '/task/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.90jian.v1+json'
  }
};


module.exports = function(data){

  return new Promise(function(resolve, reject){

    var postData = JSON.stringify(data);

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