// var http = require('http');

var express = require('express');
var bodyParser = require('body-parser');
var port = 8080;

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10
};

var yelp = require('yelp').createClient({
  consumer_key: 'FwKUb0xqcqzUq7H-ls-Y4Q', 
  consumer_secret: 'E_EMUTnLWkqCSgYkrsAgwwvKKB8',
  token: 'AXExLeWrb1_DJuwiBiTVbFXIDb6miPnH',
  token_secret: 'FzZZnSiUCg7UcVF5C3Li4cAPxIc'
});

var handleRequest = function(req, res) {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  console.log('req.body', req.body);

  res.header(defaultCorsHeaders);

  yelp.search({
    term: 'fun',
    location: req.body.userLocation
    // cll: '-122.4092135,37.783729699999995'
  }, function(error, data) {
    if(error) { 
      console.log(error);
      return;
    }
    res.send(data.businesses);
  });

  // res.send('hey');

};

app.get('/', function(req, res) {
  handleRequest(req, res);
});

app.post('/', function(req, res) {
  handleRequest(req, res);
});

app.listen(port);
console.log('App is listening on ' + port);