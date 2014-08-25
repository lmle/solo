var http = require('http');
var port = 8080;
var ip = '127.0.0.1';

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10
};

var handleRequest = function(req, res) {

  console.log('req.body', req);
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  res.writeHead(200, defaultCorsHeaders);

  yelp.search({
    term: 'fun',
    location: 'San Francisco',
    cll: '-122.4092135,37.783729699999995'
  }, function(error, data) {
    if(error) { 
      console.log(error);
      return;
    }

    res.end(JSON.stringify(data.businesses));

  });

};

var server = http.createServer(handleRequest);

console.log('Listening on http://' + ip + ':' + port);
server.listen(port, ip);

var yelp = require('yelp').createClient({
  consumer_key: 'FwKUb0xqcqzUq7H-ls-Y4Q', 
  consumer_secret: 'E_EMUTnLWkqCSgYkrsAgwwvKKB8',
  token: 'AXExLeWrb1_DJuwiBiTVbFXIDb6miPnH',
  token_secret: 'FzZZnSiUCg7UcVF5C3Li4cAPxIc'
});

// See http://www.yelp.com/developers/documentation/v2/search_api
// yelp.search({
//   term: 'fun',
//   location: 'San Francisco',
//   cll: '-122.4092135,37.783729699999995'
// }, function(error, data) {
//   if(error) { 
//     console.log(error);
//     return;
//   }

//   console.log('data.businesses', data.businesses.length);
// });

// See http://www.yelp.com/developers/documentation/v2/business
// yelp.business('yelp-san-francisco', function(error, data) {
//   console.log(error);
//   console.log(data);
// });