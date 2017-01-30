var express = require('express');
var compression=require('compression');
var app = express();
var oneDay = 86400000;

//use gzipo
//

//app.use(express.compress());


var logger = function(logit){
  return function(...args){
    if (!logit) return;
    console.log(...args);
  }
}

var addHeader = function(req, options, key, name, value, log){
  if (req.query[key]!==undefined){
  log(`header ${name} : ${value} `);
   options.headers[name]=value;
  }
};
app.get('/static/:size/:filename', function(req,res){

 var log = logger(req.query.log!==undefined);
 log(`file ${req.params.filename} size ${req.params.size}`);

 log('static:'+req.params.filename);
  var options = {
    root: __dirname + `/public/static/${req.params.size}`,
    headers : {}
  };
  
  if (req.query.contentType){
    log('contenType:'+req.query.contentType);
    res.contentType(req.query.contentType)
  }
  addHeader(req, options, 'cookieName', 'Set-Cookie', req.query.cookieName+'='+req.query.cookieValue,log)
  addHeader(req, options, 'etag', 'Etag', req.query.etag,log)
  addHeader(req, options, 'vary', 'Vary', req.query.vary,log)
  addHeader(req, options, 'id_producto', 'id_producto', req.query.id_producto,log)
  addHeader(req, options, 'maxAge', 'Cache-Control', 'public, max-age='+req.query.maxAge,log)
  addHeader(req, options, 'cacheControl', 'Cache-Control', req.query.cacheControl,log)
/*
  if (req.query.cookieName && req.query.cookieValue){
    log(`cookie ${req.query.cookieName}=${req.query.cookieValue}`)
    options.headers['Set-Cookie']= req.query.cookieName+'='+req.query.cookieValue;
  }
  if (req.query.etag){
    log(`etag ${req.query.etag}`)
    options.headers['Etag']= req.query.etag;
  }
  if (req.query.maxAge){
    log('maxAge:'+req.query.maxAge);
    options.headers['Cache-Control']= 'public, max-age='+req.query.maxAge;
  }
*/
  res.sendFile(req.params.filename, options);
});
app.use(express.static(__dirname + '/public', {maxAge:oneDay}));
app.listen(process.env.PORT || 3000);
