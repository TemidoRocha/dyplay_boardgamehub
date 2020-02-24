'use strict';

const { Router } = require('express');

const router = new Router();
// channel routes
router.get('/', (req, res, next) => {
  res.render('channels');
});

router.get('/create', (req, res, next) => {
  res.render('channels/create');
});
router.post('/create', (req, res, next) => {
  const { id } = req.body;
  res.redirect('channels/:channel_id');
});

router.get('/:channel_id', (req, res, next) => {
  const { id } = req.body;

  res.render('channels/singleview');
});
router.get('/:channel_id/edit', (req, res, next) => {
  const { id } = req.body;
  res.render('channels/edit');
});

router.get('/:channel_id/edit', (req, res, next) => {
  const { id } = req.body;
  res.render('channels/edit');
});
router.post('/:channel_id/edit', (req, res, next) => {
  const { id } = req.body;
  res.redirect('channels/:channel_id');
});

// posts routes

router.get('/:channel_id/:post_id', (req, res, next) => {
  const { id } = req.body;
  res.render('channels/post/singlepost');
});

router.get('/:channel_id/:', (req, res, next) => {
  const { id } = req.body;
  res.render('channels/post/singlepost');
});

module.exports = router;
