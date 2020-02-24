'use strict';

const { Router } = require('express');



const router = new Router();

router.get('/', (req, res, next) => {
  res.render('chennels');
});


router.get('/create', (req, res, next) =>{
  res.render('channels/create')
})
module.exports = router;
