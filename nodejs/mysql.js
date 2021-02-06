var mysql = require('mysql'); // mysql 모듈 가져오기

var connection = mysql.createConnection({ // createConnection메소드를 사용하고 인자로 객체를 줌
	    host : '127.0.0.1', // 데이터베이스 서버가 있는 주소
        user : 'test',
        password : 'test',
        database : 'openturorials' // 사용할 데이터베이스 이름
});

connection.connect(); // connect메소드를 호출하면 접속이 됨

connection.query('SELECT * FROM topic', function(err, results){
// query메소드에서 첫번째 인자로 sql쿼리문을 주고, 두번째 인자로 callback을 줌
// callback함수의 첫번째 인자로 error, 두번째 인자로 접속 결과를 줌
	
    if(err){
    	console.log(err);
    }
    console.log("결과 -> ",results); // topic의 데이터가 객체형태로 반환
});

connection.end();