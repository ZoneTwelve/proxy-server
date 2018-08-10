var http = require('http');
var url = require('url');
var request = require('request');

http.createServer(route).listen(3000);

function onRequest(req, res) {
  console.log(req.query, req.post);
  // return res.end("施工中...");
  if(req.url) {
    request({
      url: req.url
    }).on('error', function(e) {
      res.end(e);
    }).pipe(res);
  }
  else {
    res.end("no url found");
  }
}

function route(req, res){
  switch(req.method){
    case 'GET':
      return getMiddleware(req, res);
    break;
    case 'POST':
      return postMiddleware(req, res);
    break;
  }
}

function getMiddleware(req, res){
  var q = url.parse(req.url, true);
  req.query = q.query;
  req.pathname = q.pathname;
  onRequest(req, res);
}

function postMiddleware(req, res){
  var body = '';
  req.on('data', function (data) {
    body += data;
    if(body.length>1e6)
      req.connection.destroy();
  });
  req.on('end', function(){
    req.post = qs.parse(body);
    getMiddleware(req, res);
  });
}
