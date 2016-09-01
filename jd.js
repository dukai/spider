"use strict"
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: false, webPreferences: {
   // images: false 
}})
var fs = require('fs');
var path = require('path');
var http = require('http');


http.get('http://dc.3.cn/category/get', res => {
  console.log(`Got response: ${res.statusCode}`);

  // res.setEncoding('utf8');
  var html = '';
  res.on('data', (chunk) => {
    // console.log(`BODY: ${chunk}`);
    html += chunk;
  });
  res.on('end', () => {
    console.log('No more data in response.')


    var data = JSON.parse(html);
    for(var item of data){
      for(var s of item.s){
        
      }
    }
  })

}).on('error', e => {
    console.log(`Got error ${e.message}`);
})



// nightmare.goto('http://dc.3.cn/category/get?callback=getCategoryCallback').evaluate(() => {
//     return document.body;
// }).then(result => {
//     console.log(result)
// }).catch(error => {
//     console.error(error);
// })
