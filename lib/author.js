var db = require('./db');
var template = require('./template');
var url = require('url'); // node.js가 갖고 있는 모듈중 url모듈을 사용할 것이다.
var qs = require('querystring');
var sanitizeHTML = require('sanitize-html');
exports.home = function(request,response) {
    db.query(`SELECT * FROM topic`, function (error, topics) {
        db.query(`SELECT * FROM author`, function(error2, author) {
            const title = 'author';
            const list = template.list(topics);
            const html = template.html(title, list,
                ` ${template.authorTable(author)}
                <style>
                    table {
                        border-collapse:collapse;
                    }
                    td {
                        border:1px solid #222;
                    }
                </style>
                <form action="/author/create_process" method="post">
                    <p>
                        <input type="text" name="name" placeholder="name">
                    </p>
                    <p>
                        <textarea name="profile" placeholder="profile"></textarea>
                    </p>
                    <p>
                        <input type="submit" value="create">
                    </p>
                </form>
                `,
                ``
                );
            response.writeHead(200);
            response.end(html);
        
        })
        
    })
}

exports.create_process = function(request,response) {
    let body = "";
    request.on('data',function(data){
        body += data;
    });

    request.on('end', function(){
        const post = qs.parse(body); 
        console.log('POST :: ',post)
        db.query(`
        INSERT INTO author(name,profile)
        VALUES (? ,?)
        `,[post.name,post.profile],function(error,result){
            if (error){
                throw error;
            }
            response.writeHead(302, {Location:`/author`});
            response.end();
        })      
    })
}

exports.update = function(request,response) {
    db.query(`SELECT * FROM topic`, function (error, topics) {
        const _url = request.url;
        const queryData = url.parse(_url,true).query;
        db.query(`SELECT * FROM author`, function(error2, author) {
            db.query(`SELECT * FROM author WHERE id = ?`,[queryData.id] , function(error3, author) {
                const title = 'author';
                const list = template.list(topics);
                const html = template.html(title, list,
                    ` ${template.authorTable(author)}
                    <style>
                        table {
                            border-collapse:collapse;
                        }
                        td {
                            border:1px solid #222;
                        }
                    </style>
                    <form action="/author/update_process" method="post">
                        <p>
                            <input type="hidden" name="id" value=${queryData.id} >
                        </p>
                        <p>
                            <input type="text" name="name" value=${sanitizeHTML(author[0].name)} placeholder="name">
                        </p>
                        <p>
                            <textarea name="profile" placeholder="profile">${sanitizeHTML(author[0].profile)}</textarea>
                        </p>
                        <p>
                            <input type="submit" value="update">
                        </p>
                    </form>
                    `,
                    ``
                    );
                response.writeHead(200);
                response.end(html);
            })
        })
    })
}

exports.update_process = function(request,response) {
    let body = '';
    request.on('data',function(data){
        body += data;
    });

    request.on('end',function(){
        const post = qs.parse(body);
        db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
        [post.name,post.profile,post.id],function(error,result){
            if (error){
                throw error;
            }
            response.writeHead(302, {Location:`/author`});
            response.end();
        })
    });
}

exports.delete_process = function (request,response) {
    let body = '';
    request.on('data',function(data){
        body += data;
    });

    request.on('end',function(){
        const post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE author_id=?`,[post.id], function(error,result){
            if (error){
                throw error ;
            }
            db.query(`DELETE FROM author WHERE id=?`,
            [post.id],function(error2,result){
            if (error2){
                throw error2;
            }
            response.writeHead(302, {Location:`/author`});
            response.end();
        })
        })
        
    });
}