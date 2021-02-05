var http = require('http');
var fs = require('fs');
var url = require('url'); // node.js가 갖고 있는 모듈중 url모듈을 사용할 것이다.
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

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

    } else {
      response.writeHead(404);
      response.end('Not Found')
    }
       
    
 
});
app.listen(3000);