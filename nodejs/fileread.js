const fs = require('fs'); // file시스템 다루기 
fs.readFile('sample.txt', 'utf8', function(err,data){
    console.log(data);
});