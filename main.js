const express = require('express');
const app = express(); //express는 함수  
const bodyParser = require('body-parser');
const compression = require('compression');
const indexRouter = require('./routes/index');
const topicRouter = require('./routes/topic');
const authorRouter = require('./routes/author');

/**
 * 1. 미들웨어 사용시 require로 가져와서 사용한다.
 * 2. 사용시 use라는 메서드를 활용한다.
 */
app.use(helmet()); // 보안을 위한 미들웨어 
app.use(express.static('public')); //public 폴더안에서 image를 찾는다는의미, 정적인파일을 서비스하고자하는 폴더를 직접 지정해주면 url을 통해 접근이 가능하다.
// 사용자가 요청할떄마다 아래코드로 인해서 만들어진 미들웨어가 실행되는데 내부적으로 사용자가 전송한 포스트데이터를 
app.use(bodyParser.urlencoded({ extended: false}));
app.use(compression()); // 미들웨어는 함수이다. 파라마타 1. request 2. response 3. next는 호출되어야될 미들웨어 변수 약속


app.use('/', indexRouter);
app.use('/topic',topicRouter);
app.use('/author', authorRouter);
/*app.get('/', function(req,res){
  return res.send('Hello world')
})*/

// 미들웨어는 순차적으로 진행되기때문에 가장 마지막에 선언함.
app.use(function(req,res,next) {
  res.status(404).send('Sorry can not page');
})


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