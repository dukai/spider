"use strict"
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: false, webPreferences: {
   // images: false 
}})
var fs = require('fs');
var path = require('path');

//nightmare
//  .goto('http://www.jd.com')
//  .type('#search-2014 .form input.text', 'ssd')
//  .click('#search-2014 .form button')
//  .wait('#J_goodsList')
//  .evaluate(function () {
//    var result = [];
//		window.jQuery('.gl-item').each(function(){
//     var title = window.jQuery(this).find('.p-name>a').attr('title');
//     var price = window.jQuery(this).find('.p-price>strong').data('price');
//     result.push({
//      title, price
//     });
//    })
//    return result;
//  })
//  .end()
//  .then(function (result) {
//    console.log(result)
//  })
//  .catch(function (error) {
//    console.error('Search failed:', error);
//  });


var lastURL = null;
var map = [];

var parsePage = function(url){


    nightmare.goto(url)
    // .type('form input', 'ssd')
    // .click('form button')
    // .wait('#J_ItemList')
    .evaluate(function(){
        var result = [];
        var list = document.querySelectorAll('#J_ItemList .product .productPrice em');
        var list2 = document.querySelectorAll('#J_ItemList .product .productTitle a');
        for(var i = 0; i < list.length; i++){
            var ni = list[i];
            // var price = ni.querySelector('.productPrice em').title;
            // var title = ni.querySelector('.productTitle a').title;
            var price = ni.title;
            var title = list2[i].title;

            result.push({title, price});
        }

        return result;

    })
    // .end()
    .then(function(result){
        // console.log(result);

        map = map.concat(result);

        console.log(result.length);

        var obj = nightmare.click('.ui-page-next').wait('#J_ItemList')
            .url()
            .then(function(url){
                console.log(url);
                if(lastURL != url){
                    lastURL = url;
                    parsePage(url);
                }else{
                    console.log("读取结束");
                    nightmare.end();
                    fs.writeFileSync([__dirname, 'list.json'].join(path.sep), JSON.stringify(map, true, 2));
                }
            });
    })

    .catch(function(err){
        console.error('faild:', err);
    })
}

var url = 'https://list.tmall.com/search_product.htm?q=ssd&type=p&vmarket=&spm=875.7931836%2FA.a2227oh.d100&from=mallfp..pc_1_searchbutton';

parsePage(url);