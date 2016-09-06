"use strict"
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true, webPreferences: {
   images: false 
}})
var fs = require('fs');
var path = require('path');
var http = require('http');

var listPageURLs = [];


var httpRequest = require('./request');

var getURLList = function(){

    http.get('http://dc.3.cn/category/get', res => {
      console.log(`Got response: ${res.statusCode}`);

      // res.setEncoding('utf8');
      var html = '';
      res.on('data', (chunk) => {
        html += chunk;
      });
      res.on('end', () => {

        var re = /"(list\.jd\.com.+?)\|/ig;

        var result = null;

        while(result = re.exec(html)){
            listPageURLs.push(result[1]);
        }

        console.log(listPageURLs);

        beginParse();

      })

    }).on('error', e => {
        console.log(`Got error ${e.message}`);
    })
}


var beginParse = function(){
    if(listPageURLs.length == 0){
        console.log('===== ALL DONE =====');
        return;
    }
    var url = listPageURLs.pop();
    url = 'http://' + url;
    console.log(url);
    parseOne(url);
}

var parseOne = function(url){
    nightmare.goto(url).evaluate(() => {
        var prices = document.querySelectorAll('.gl-item .J_price i');
        var links = document.querySelectorAll('.gl-item .p-name a');
        var titles = document.querySelectorAll('.gl-item .p-name a em');

        var result = [];

        for(var i = 0; i < prices.length; i++){
            result.push({
                price: prices[i].innerHTML,
                title: titles[i].innerHTML,
                href: links[i].href
            })
        }

        return result;
    }).then(result => {
        console.log(`==== PAGE DONW (${result.length} ====`);
        httpRequest({result});

        nightmare.evaluate(() => {
            var nextBtn = document.querySelector('.pn-next');
            if(nextBtn){
                return nextBtn.href;
            }else{
                return null;
            }

        }).then(result => {
            if(result){
                parseOne(result);
            }else{
                console.log('==== ONE LIST DONE ====');
                beginParse();
            }
        })

    }).catch(error => {
        console.log(error);
        parseOne(error.url);
    });
}

// parseOne('http://list.jd.com/list.html?cat=1319,1523,7052&ev=4975_86120&page=1&go=0&trans=1&JL=6_0_0#J_main')
// parseOne('http://list.jd.com/list.html?cat=1713,13613&page=26&go=0&trans=1&JL=6_0_0');

getURLList();