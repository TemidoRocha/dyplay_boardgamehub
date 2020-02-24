'use strict';

const { Router } = require('express');

const router = new Router();

const Channel = require('./../models/channel');

// posts routes

router.get('/:channel_id/create_post', (req, res, next) => {
  const { id } = req.body;
  res.render('channels/post/create');
});
router.post('/:channel_id/create_post', (req, res, next) => {
  const { id } = req.body;
  res.redirect('channels/:post_id/singlepost');
});
router.get('/:channel_id/:post_id', (req, res, next) => {
  const { id } = req.body;
  res.render('channels/post/singlepost');
});

router.get('/:channel_id/:post:id/edit', (req, res, next) => {
  const { id } = req.body;
  res.render('channels/post/edit');
});
router.post('/:channel_id/:post:id/edit', (req, res, next) => {
  const { id } = req.body;
  res.redirect('channels/:post_id/singlepost');
});

// channel routes
router.get('/', (req, res, next) => {
  res.render('channels');
});

router.get('/create', (req, res, next) => {
  res.render('channels/create');
});
router.post('/create', (req, res, next) => {
  const { name } = req.body;
  Channel.create({
    name
  })
    .then(channel => {
      res.redirect(`/channel/${channel._id}`);
    })
    .catch(error => {
      next(error);
    });
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

module.exports = router;
