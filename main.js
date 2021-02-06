var http = require('http');
var fs = require('fs');
var url = require('url'); // node.js가 갖고 있는 모듈중 url모듈을 사용할 것이다.
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html'); // XSS공격등을 방어




var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;



    if (pathname === '/') {
      fs.readdir('./data',function(error, filelist){
        var list = template.list(filelist);

        if (queryData.id === undefined) {
          const title = 'Welcome';
          const description = 'Hello.Node.js';
          var html = template.html(title,list,`<h2>${title}</h2>${description}`,
          `<a href="/create">글 작성하기</a>
          `);
          response.writeHead(200);
          response.end(html);
        } else {
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`,'utf8',function(err,description){
            const title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizeDescription = sanitizeHtml(description);
            const html = template.html(sanitizedTitle,list,`<h2>${sanitizedTitle}</h2>${sanitizeDescription}`,
            `<a href="/create">작성하기</a>
            <a href="/update?id=${sanitizedTitle}">수정하기</a>
            <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}"/>
            <input type="submit" value="delete" />
            </form>`);
            response.writeHead(200);
            response.end(html);
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
          var list = template.list(filelist)
          var html = template.html(title,list,`
          <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
          <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
          <input type="submit">
          </p>
          </form>
          `,``);
          response.writeHead(200);
          response.end(html);
      })
    } else if(pathname === '/create_process') {
      var body = "";
      request.on('data', function(data) {
        body = body + data; // callback 데이터를 추가해준다.
      });

      request.on('end', function(){
        var post = qs.parse(body); // 지금까지 저장한 body값을 주면
        var title = post.title;
        var description = post.description;
        console.log(post.title);
        fs.writeFile(`data/${title}`, description,'utf8', function(){
          response.writeHead(302, {Location: `/?id=${title}`}); // 페이지 리다이렉트
          response.end();
        })
      });
      

    } else if(pathname === '/update') {
      fs.readdir('./data',function(error, filelist){
        var filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`,'utf8',function(err,description){
              const title = queryData.id;
              var list = template.list(filelist)
              var html = template.html(title,list,
              `
              <form action="/update_process" method="post">
              <input type="hidden" name="id" value=${title}/>
              <p><input type="text" name="title" placeholder="title" value=${title}></p>
              <p>
              <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
              <input type="submit">
              </p>
              </form> 
              `,
              `<a href="/create">글 작성하기</a>
              <a href="/update?id=${title}">글 수정하기</a>`);
              response.writeHead(200);
              response.end(html);
            }) ;
      })
    } else if (pathname === '/update_process') {
      var body = '';
      request.on('data', function(data){
        body =  body + data;
      })
      request.on('end',function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        console.log(post);

        fs.rename(`data/${id}`,`data/${title}`, function(error){
          fs.writeFile(`data/${title}`, description, 'utf8', function(){
            response.writeHead(302, {Location:`/?id=${title}`});
            response.end();
          })
        })
      })

    } else if (pathname === '/delete_process') {
      var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`,function(error){
          response.writeHead(302, {Location:`/`});
          response.end();
        })
      })

    } else {
      response.writeHead(404);
      response.end('Not Found')
    }
       
    
 
});
app.listen(3000);