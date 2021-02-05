var http = require('http');
var fs = require('fs');
var url = require('url'); // node.js가 갖고 있는 모듈중 url모듈을 사용할 것이다.
var qs = require('querystring');

function templateHtml(title,list,body){
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    <a href="/create">글 작성하기</a>
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist) {
  var list =  '<ul>';
  var i = 0;
  while (filelist.length > i) {
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list + '</ul>';
  return list;
}



var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;



    if (pathname === '/') {
      fs.readdir('./data',function(error, filelist){
        const list = templateList(filelist)
        if (queryData.id === undefined) {
          const title = 'Welcome';
          const description = 'Hello.Node.js';
          const template = templateHtml(title,list,`<h2>${title}</h2>${description}`);
          response.writeHead(200);
          response.end(template);
        } else {
          fs.readFile(`data/${queryData.id}`,'utf8',function(err,description){
            const title = queryData.id;
            const template = templateHtml(title,list,`<h2>${title}</h2>${description}`);
            response.writeHead(200);
            response.end(template);
          }) ;
        }

      })

      // if (queryData.id === undefined) {
      //     fs.readdir('./data',function(error, filelist){
      //       var title = 'Welcome';
      //       var description = 'Hello.Node.js';
      //       var list = templateList(filelist)
      //       var template = templateHtml(title,list,`<h2>${title}</h2>${description}`);
      //       response.writeHead(200);
      //       response.end(template);
      //     })
      // } else {
      //   fs.readdir('./data',function(error, filelist){
      //     fs.readFile(`data/${queryData.id}`,'utf8',function(err,description){
      //       var title = queryData.id;
      //       var template = templateHtml(title,list,`<h2>${title}</h2>${description}`);
      //       response.writeHead(200);
      //       response.end(template);
      //     }) ;
        
      //   });

      // }

    } else if(pathname === '/create') {
      fs.readdir('./data',function(error, filelist){
          var title = 'Web -- create';
          var list = templateList(filelist)
          var template = templateHtml(title,list,`
          <form action="http://localhost:3000/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
          <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
          <input type="submit">
          </p>
          </form>
          `);
          response.writeHead(200);
          response.end(template);
      })
    } else if( pathname === '/create_process') {
      var body = "";
      request.on('data', function(data) {
        body = body + data; // callback 데이터를 추가해준다.
      });

      request.on('end', function(){
        var post = qs.parse(body); // 지금까지 저장한 body값을 주면
        var title = post.title;
        var descript = post.description;
        console.log(post.title);
      });
      
      response.writeHead(200);
      response.end('success');
    } else {
      response.writeHead(404);
      response.end('Not Found')
    }
       
    
 
});
app.listen(3000);