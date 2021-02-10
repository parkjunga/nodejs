const http = require('http');
const cookie = require('cookie');

http.createServer(function(request,response) {
    console.log(request.headers.cookie);
    var cookies = {};
    if (request.headers.cookie !== undefined){
        cookies = cookie.parse(request.headers.cookie);
    }
    console.log(cookies);
    console.log(cookies.yammy_cookie);

    // 쿠키세팅시 응답하는 메세지 조작 
    response.writeHead(200, {
        'Set-Cookie': ['yammy_cookie=choco', 'tasty_cookie=straweberry']
    });
    response.end('Cookie');
}).listen(3000);