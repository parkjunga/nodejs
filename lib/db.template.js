var mysql = require('mysql');
var db = mysql.createConnection({
    host:'',
    user:'',
    password:'',
    database : ''   
  }); // connection 생성 및 연결 
db.connect();

// 외부로 꺼내놓을 api가 하나 일경우
module.exports = db;
