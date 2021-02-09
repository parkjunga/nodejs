var db = require('./db');
var template = require('./template.js');
var url = require('url'); // node.js가 갖고 있는 모듈중 url모듈을 사용할 것이다.
var qs = require('querystring');
exports.home = function(request,response) {
    db.query(`SELECT * FROM topic`,function(error, topics){
        const title = 'Welcome';
        const description = 'Hello.Node.js';
        const list = template.list(topics);
        var html = template.html(title,list,`<h2>${title}</h2>${description}`,
        `<a href="/create">글 작성하기</a>
        `);
        response.writeHead(200);
        response.end(html);
    });
}

exports.page = function (request,response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function(error,topics){
        if (error){
          throw error;
        } 
        db.query(`SELECT * FROM topic as t 
               LEFT JOIN author as a 
                      ON t.author_id = a.id WHERE t.id =?`,[queryData.id], function(error2, topic){
          if (error2) {
            throw error2;
          }
          const title = topic[0].title;
          const description = topic[0].description;
          var list = template.list(topics);
          var html = template.html(title, list,
          `<h2>${title}</h2>
          ${description} 
          <p>by ${topic[0].name}</p>`,
          `<a href="/create">작성하기</a>
          <a href="/update?id=${queryData.id}">수정하기</a>
          <form action="delete_process" method="post">
          <input type="hidden" name="id" value="${queryData.id}"/>
          <input type="submit" value="delete" />
          </form>` );
          response.writeHead(200);
          response.end(html);
        })
      })
    
}

exports.create = function (request,response) {
    db.query(`SELECT * FROM topic`,function(error, topics){
        db.query(`SELECT * FROM author`, function(error2, authors){
          const title = 'Create';
          const list = template.list(topics);
          var html = template.html(title,list,
          `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
            ${template.authorSelect(authors)}
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
          `,
          `<a href="/create">글 작성하기</a>
          `);
          response.writeHead(200);
          response.end(html);
        })
      })
}

exports.create_process = function (request,response) {
    var body = "";
    request.on('data', function(data) {
      body = body + data; // callback 데이터를 추가해준다.
    });

    request.on('end', function(){
      var post = qs.parse(body); // 지금까지 저장한 body값을 주면
      db.query(`
      INSERT INTO topic (title, description, created, author_id) 
      VALUES(?,?,NOW(), ?)
      `,[post.title, post.description, post.author], function(error, result){
        if (error){
          throw error;
        }
        response.writeHead(302, {Location: `/?id=${result.insertId}`});
        response.end();
      });
  });
}

exports.update = function(request,response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function(error,topics){
        if (error){
          throw error;
        } 
        db.query(`SELECT * FROM topic WHERE id =?`,[queryData.id], function(error2, topic){
          if (error2) {
            throw error2;
          }
          db.query(`SELECT * FROM author`, function (error3, authors) {
            const title = topic[0].title;
            const description = topic[0].description;
            var list = template.list(topics);
            var html = template.html(title, list,
            `<form action="/update_process" method="post">
              <input type="hidden" name="id" value=${topic[0].id}>
              <p><input type="text" name="title" placeholder="title" value=${title}></p>
              <p>
              <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
              ${template.authorSelect(authors,topic[0].author_id)}
              </p>
              <p>
              <input type="submit">
              </p>
            </form> 
            `,
            `<a href="/create">글 작성하기</a>
            <a href="/update?id=${topic[0].id}">글 수정하기</a>` );
            response.writeHead(200);
            response.end(html);
          })
        })
      })
}

exports.update_process = function(request,response) {
    var body = '';
      request.on('data', function(data){
        body =  body + data;
      })
      request.on('end',function(){
        var post = qs.parse(body);
        db.query(`
          UPDATE topic SET title = ? , description = ?, author_id=1  WHERE id = ?
          `,[post.title, post.description, post.id], function(error, result){
            if (error){
              throw error;
            }
            response.writeHead(302, {Location: `/?id=${post.id}`});
            response.end();
          });
      })
}

exports.delete_process = function(request,response) {
    var body = '';
      request.on('data', function(data){
        body += data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        db.query(`
          DELETE FROM topic WHERE id = ?
          `,[post.id], function(error, result){
            if (error){
              throw error;
            }
            response.writeHead(302, {Location: `/`});
            response.end();
          });

      })
}