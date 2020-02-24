'use strict';

const { Router } = require('express');

const router = new Router();
const Post = require('./../models/post');

const Channel = require('./../models/channel');
const uploader = require('./../multer-configure.js');

// posts routes

router.get('/:channel_id/create_post', (req, res, next) => {
  const { id } = req.body;
  res.render('channels/post/create');
});
router.post('/:channel_id/create_post', uploader.single('picture'), (req, res, next) => {
  const { title, content } = req.body;
  const { channel_id } = req.params;

  const { url } = req.files;

  const author = req.user._id;

  Post.create({
    title,
    content,
    channel: channel_id,
    author,
    photos: url
  })
    .then(post => {
      res.redirect(`/channel/${post.channel}/post/${post._id}`);
    })
    .catch(error => {
      next(error);
    });
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

router.post('/create', uploader.single('picture'), (req, res, next) => {
  const author = req.user._id;
  const { name, desciption } = req.body;
  const { url } = req.files;
  Channel.create({
    name,
    desciption,
    picture: url,
    author
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
