const express = require('express');
const url = require('url'); // node.js가 갖고 있는 모듈중 url모듈을 사용할 것이다.

const app = express(); //express는 함수  

const qs = require('querystring');

const topic = require('./lib/topic');
const { request } = require('http');

// routing
app.get('/', function (request,response) {
  const _url = request.url;
  const queryData = url.parse(_url, true).query;
  const pathname = url.parse(_url, true).pathname;
    topic.home(request,response);
    
});

app.get('/page/:pageId', function(request,response) {
  topic.page(request,response);
});

app.get('/create', (request,response) => topic.create(request,response));

app.post('/create', (request,response) => topic.create_process(request,response));

app.get('/update/:pageId', (request,response) => topic.update(request,response));

app.post('/update',(request,response) => topic.update_process(request,response));

app.post('/delete_process', (request,response) => topic.delete_process(request,response));
/*app.get('/', function(req,res){
  return res.send('Hello world')
})*/
app.listen(3000, () => console.log('Example app listening on port 3000!'));

// var http = require('http');
// var fs = require('fs');
// var url = require('url'); // node.js가 갖고 있는 모듈중 url모듈을 사용할 것이다.
// var qs = require('querystring');
// var template = require('./lib/template.js');
// var db = require('./lib/db');
// var topic = require('./lib/topic');
// var author = require('./lib/author');

// var app = http.createServer(function(request,response){
//     var _url = request.url;
//     var queryData = url.parse(_url, true).query;
//     var pathname = url.parse(_url, true).pathname;

//     if (pathname === '/') {
//         if (queryData.id === undefined) {
//           topic.home(request,response);
//         } else {
//           topic.page(request,response);
//         }

//     } else if(pathname === '/create') {
//       topic.create(request,response);

//     } else if(pathname === '/create_process') {
//       topic.create_process(request,response);
    
//     } else if(pathname === '/update') {
//       topic.update(request,response);
    
//     } else if (pathname === '/update_process') {
//       topic.update_process(request,response);
      
//     } else if (pathname === '/delete_process') {
//       topic.delete_process(request,response);

//     } else if (pathname === '/author') {

//       author.home(request,response);
//     } else if (pathname === '/author/create_process') {

//       author.create_process(request, response);
//     } else if (pathname === '/author/update') {
//       author.update(request,response);
//     } else if (pathname === '/author/update_process') {
//       author.update_process(request,response);
//     } else if (pathname === '/author/delete_process') {
//       author.delete_process(request,response);
//     } else {
//       response.writeHead(404);
//       response.end('Not Found')
//     }
 
// });
// app.listen(3000);