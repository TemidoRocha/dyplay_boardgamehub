'use strict';

const { Router } = require('express');



const router = new Router();

router.get('/', (req, res, next) => {
  res.render('channels');
});


router.get('/create', (req, res, next) =>{
  res.render('channels/create')
})

// router.get('/:channel_id', req, res, next) => {
//   res.render('channels/singleview')
// })
module.exports = router;
