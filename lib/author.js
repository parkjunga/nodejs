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
                <form action="/author/create" method="post">
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
    // let body = "";
    // request.on('data',function(data){
    //     body += data;
    // });

    // request.on('end', function(){
//        const post = qs.parse(body);
/** 위에 소스를 주석처리한 이유는 main에서 request.body를 파싱하는 미들웨어를 사용하여 위 로직이 필요없다. */ 
        const post = request; 
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
    // })
}

exports.update = function(request,response) {
    db.query(`SELECT * FROM topic`, function (error, topics) {
        //const _url = request.url;
        //const queryData = url.parse(_url,true).query;
        db.query(`SELECT * FROM author`, function(error2, author) {
            db.query(`SELECT * FROM author WHERE id = ?`,[request.params.authorId] , function(error3, author) {
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
                    <form action="/author/update" method="post">
                        <p>
                            <input type="hidden" name="id" value=${request.params.authorId} >
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
        const post = request;
        db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
        [post.name,post.profile,post.id],function(error,result){
            if (error){
                throw error;
            }
            response.writeHead(302, {Location:`/author`});
            response.end();
        })
}

exports.delete_process = function (request,response) {

        const post = request;
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
       
}