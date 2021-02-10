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
        `<a href="/topic/create">글 작성하기</a>
        <img src="/images/hello.jpg" style="width:300px; display:block"/>
        `);
        response.writeHead(200);
        response.end(html);
    });
}

exports.page = function (request,response) {
    db.query(`SELECT * FROM topic`, function(error,topics){
        if (error){
          throw error;
        } 
        console.log(request.params.pageId,"// //<--- ");
        db.query(`SELECT * FROM topic as t 
               LEFT JOIN author as a 
                      ON t.author_id = a.id WHERE t.id =?`,[request.params.pageId], function(error2, topic){
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
          `<a href="/topic/create">작성하기</a>
          <a href="/topic/update/${request.params.pageId}">수정하기</a>
          <form action="/topic/delete" method="post">
          <input type="hidden" name="id" value="${request.params.pageId}"/>
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
          <form action="/topic/create" method="post">
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
          `<a href="/topic/create">글 작성하기</a>
          `);
          response.writeHead(200);
          response.end(html);
        })
      })
}

exports.create_process = function (request,response) {

      var post = request; // 지금까지 저장한 body값을 주면
      db.query(`
      INSERT INTO topic (title, description, created, author_id) 
      VALUES(?,?,NOW(), ?)
      `,[post.title, post.description, post.author], function(error, result){
        if (error){
          throw error;
        }
        response.redirect(`/topic/${result.insertId}`);
      });
}

exports.update = function(request,response) {
    var _url = request.url;
    db.query(`SELECT * FROM topic`, function(error,topics){
        if (error){
          throw error;
        } 
        db.query(`SELECT * FROM topic WHERE id =?`,[request.params.pageId], function(error2, topic){
          if (error2) {
            throw error2;
          }
          db.query(`SELECT * FROM author`, function (error3, authors) {
            const title = topic[0].title;
            const description = topic[0].description;
            var list = template.list(topics);
            var html = template.html(title, list,
            `<form action="/topic/update" method="post">
              <input type="hidden" name="id" value=${request.params.pageId}>
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
            `<a href="/topic/create">글 작성하기</a>
            <a href="/topic/update/${request.params.pageId}">글 수정하기</a>` );
            response.writeHead(200);
            response.end(html);
          })
        })
      })
}

exports.update_process = function(request,response) {

        var post = request;
        db.query(`
          UPDATE topic SET title = ? , description = ?, author_id=?  WHERE id = ?
          `,[post.title, post.description, post.author ,post.id], function(error, result){
            if (error){
              throw error;
            }
            response.redirect(`/topic/${post.id}`);
          });

}

exports.delete_process = function(request,response) {
    var post = request;
        db.query(`DELETE FROM topic WHERE id=?`,[post.id], function(error,result){
            if (error){
                throw error ;
            }
            response.redirect('/');
        })
}