//API Abstraction Layer

//imports
var http = require('http'),
httpProxy = require('http-proxy'),
urlHelper = require('./helpers/url.helper.js'),
endpoints = require('./data/endpoints.json').routes;


// create and start http server
var server = http.createServer(function (req, res) {
  if(req.url == "/" || req.url == "/healthz"){
    res.writeHead(200);
    res.end();
  }else{
    for (id in endpoints) {
      if (endpoints.hasOwnProperty(id) && handleRoute(endpoints[id], req, res)) {
        return;
      }
    }
    returnError(req, res);
  }
});

//
//
//Server Proxy
//**SIMPLY FORWARDS REQUESTS
//**TO RELEVANT MICROSERVICE
//
//

//create http proxy server
var proxy = new httpProxy.createProxyServer();

// proxy HTTP request / response to / from destination upstream service if route matches
function handleRoute(route, req, res) {
  var url = req.url;
  var parsedUrl = urlHelper.parse(req);
  if (parsedUrl.path.indexOf(route.apiRoute) === 0) {
    if(typeof parsedUrl.path[route.apiRoute.length] == 'undefined' || parsedUrl.path[route.apiRoute.length] == "/"){
      req.url = url.replace(route.apiRoute, '');
      proxy.web(req, res, { target: route.serviceUrl });
      return true;
    }
  }
}

function returnError(req, res) {
  res.writeHead(502, {'Content-Type': 'text/plain'});
  res.write('Bad Gateway for:' + req.url);
  res.end();
}

//
//
//
//
//

proxy.on('error', function (err, req, res) {
  console.log(err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('Something went wrong. And we are reporting a custom error message.');
});


//begin listening on port 8080
server.listen(8080, function(){
  console.log("REST API Abstraction Layer listening on ", server.address())
});
