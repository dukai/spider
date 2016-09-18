"use strict"
var Nightmare = require('nightmare');
var nightmare = Nightmare({ 
    show: true, 
    webPreferences: {
        //images: false 
    }
})
var fs = require('fs');
var path = require('path');
var http = require('http');

var listPageURLs = [];

const LIST_FILE_NAME = [__dirname, 'list.json'].join(path.sep);
const CURRENT_FILE_NAME = [__dirname, 'current'].join(path.sep);

var httpRequest = require('./request');

var beginJD = function(){
    try{
        //READ file detect whether need to process from local
        var list = fs.readFileSync(LIST_FILE_NAME, {encoding: 'utf8'});
        listPageURLs = JSON.parse(list);
        var currentURL = fs.readFileSync(CURRENT_FILE_NAME, {encoding: "utf8"});
        parseOne(currentURL);
    }catch(ex){
        getURLList();
    }
}

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
        nightmare.end();
        return;
    }
    var url = listPageURLs.pop();
    url = 'http://' + url;
    console.log('Plan to parse next: ', url, ' Remaie: ', listPageURLs.length);
    fs.writeFileSync(LIST_FILE_NAME, JSON.stringify(listPageURLs, 2));
    parseOne(url);
}

var parseOne = function(url){
    console.log('Start Request: ', url);
    nightmare.goto(url).evaluate(() => {
        var prices = document.querySelectorAll('#plist .gl-item .J_price i');
        var links = document.querySelectorAll('#plist .gl-item .p-name>a');
        var titles = document.querySelectorAll('#plist .gl-item .p-name>a em');
        console.log(prices, links, titles);

        var result = [];

        for(var i = 0; i < prices.length; i++){
            result.push({
                price: prices[i].innerHTML,
                title: titles[i].innerHTML,
                url: links[i].href
            })
        }

        return result;
    }).then(result => {
        console.log(`==== Request (${url}) Done (${result.length}) ====`);

        console.log(result);
        httpRequest({result}).then(r => {}, e => console.log(e));

        // nightmare.evaluate(() => {
        //     return document.title;
        // }).then(title =>{
        //     console.log("Page title: ", title);
        // });

        nightmare.evaluate(() => {
            var nextBtn = document.querySelector('.pn-next');
            if(nextBtn){
                return nextBtn.href;
            }else{
                return null;
            }

        }).then(newURL => {
            if(newURL){
                parseOne(newURL);
            }else{
                console.log('==== ONE LIST DONE ====');
                beginParse();
            }
        });

        fs.writeFileSync(CURRENT_FILE_NAME, url);

    }).catch(error => {
        console.log(error);
        if(error.code == -7){
            parseOne(error.url);
        }
    });
}

// parseOne('http://list.jd.com/list.html?cat=1319,1523,7052&ev=4975_86120&page=1&go=0&trans=1&JL=6_0_0#J_main')
// parseOne('http://list.jd.com/list.html?cat=9987,653,655&page=80&trans=1&JL=6_0_0#J_main');
parseOne('http://coll.jd.com/list.html?sub=4520&page=1&JL=6_0_0')

// beginJD();