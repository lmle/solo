var express = require('express');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;

var app = express();

// For CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(__dirname));

// Serve index.html
app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

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
    // category_filter: 'active',
    location: req.body.userLocation
    // radius_filter: 40000
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

app.post('/yelp', function(req, res) {
  handleRequest(req, res);
});

app.listen(port);
console.log('Listening on port', port);
