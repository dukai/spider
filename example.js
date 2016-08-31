var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true })

nightmare
  .goto('http://www.jd.com')
  .type('#search-2014 .form input.text', 'ssd')
  .click('#search-2014 .form button')
  .wait('#J_goodsList')
  .evaluate(function () {
    var result = [];
		window.jQuery('.gl-item').each(index => {
     var title = window.jQuery(this).find('.p-name>a').attr('title');
     var price = window.jQuery(this).find('.p-price>strong').data('price');
     result.push({
      title, price
     });
     return result;
    })
  })
  .end()
  .then(function (result) {
    console.log(result)
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });
