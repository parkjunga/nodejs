const express = require('express');
const router = express.Router(); // 라우터 매서드 호출ㄴ
const author = require('../lib/author');


router.get('/', (request,response) => author.home(request,response));

router.post('/create', (request,response) => author.create_process(request.body,response));

router.get('/update/:authorId', (request,response) => author.update(request,response));

router.post('/update', (request,response) => author.update_process(request.body,response));

router.post('/delete', (request,response) => author.delete_process(request.body, response));

module.exports = router;