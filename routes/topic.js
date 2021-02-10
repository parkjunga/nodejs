const express = require('express');
const router = express.Router(); // 라우터 매서드 호출ㄴ
const topic = require('../lib/topic');


router.get('/create', (request,response) => topic.create(request,response));

router.post('/create', (request,response) => topic.create_process(request.body,response));

router.get('/update/:pageId', (request,response) => topic.update(request,response));

router.post('/update',(request,response) => topic.update_process(request.body,response));

router.post('/delete', (request,response) => topic.delete_process(request.body,response));

router.get('/:pageId',  (request,response) => topic.page(request,response));

// main.js는 express 잧를 호출 topic.js는 express내 메서드를 호출 


module.exports = router;