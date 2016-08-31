var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true })

nightmare
  .goto('http://www.jd.com')
  .type('#search-2014 .form input.text', 'ssd')
  .click('#search-2014 .form button')
  .wait('#J_goodsList')
  .evaluate(function () {
		return window.jQuery('.gl-item');
		return document.querySelectorAll('.gl-item');
  })
  .end()
  .then(function (result) {
    console.log(result)
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });
