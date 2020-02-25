'use strict';

const { Router } = require('express');

const router = new Router();
const Post = require('./../models/post');

const Channel = require('./../models/channel');
const Comments = require('./../models/comments');
const uploader = require('./../multer-configure.js');

//comments routes

router.post('/:channel_id/:post_id/comment', (req, res, next) => {
  const { channel_id, post_id } = req.params;
  const { content } = req.body;

  Post.findById(post_id)
    .then(post => {
      if (!post) {
        return Promise.reject(new Error('NOT_FOUND'));
      } else {
        return Comments.create({
          channel: channel_id,
          post: post_id,
          author: req.user._id,
          content
        });
      }
    })
    .then(() => {
      res.redirect(`/channels/${channel_id}/${post_id}`);
    })
    .catch(error => {
      next(error);
    });
});

// posts routes

router.get('/:channel_id/create_post', (req, res, next) => {
  res.render('channels/posts/create');
});

router.post('/:channel_id/create_post', uploader.single('picture'), (req, res, next) => {
  const { title, description } = req.body;
  const { channel_id } = req.params;

  const { url } = req.file;

  Post.create({
    title,
    description,
    channel: channel_id,
    author: req.user._id,
    picture: url
  })
    .then(post => {
      res.redirect(`${channel_id}/${post._id}`, post);
    })
    .catch(error => {
      next(error);
    });
});
router.get('/:channel_id/edit', (req, res, next) => {
  const { channel_id } = req.params;
  Channel.findOne({
    _id: channel_id,
    author: req.user._id
  })
    .then(data => {
      if (data) {
        res.render(`channels/edit`, { data });
      } else {
        next(new Error('NOT_FOUND'));
      }
    })
    .catch(error => {
      next(error);
    });
});
router.post('/:channel_id/edit', uploader.single('picture'), (req, res, next) => {
  const { channel_id } = req.params;
  const { name, description } = req.body;
  const { url } = req.file;
  Channel.findOneAndUpdate(
    {
      _id: channel_id,
      author: req.user._id
    },
    {
      name,
      description,
      picture: url
    }
  )
    .then(() => {
      res.redirect(`/channels/${channel_id}`);
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:channel_id/:post_id', (req, res, next) => {
  const { post_id } = req.params;

  let post;
  Post.findById(post_id)
    .populate('channel author')
    .then(document => {
      post = document;
      if (!document) {
        return Promise.reject(new Error('NOT_FOUND'));
      } else {
        return Comments.find({ post: post_id }).populate('author');
      }
    })
    .then(comments => {
      console.log(post);
      res.render('channels/posts/singlepost', { post, comments });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:channel_id/:post_id/edit', (req, res, next) => {
  const { post_id } = req.params;

  Post.findOne({
    _id: post_id,
    author: req.user._id
  })
    .then(post => {
      if (post) {
        res.render('channels/posts/edit', { post });
      } else {
        next(new Error('NOT_FOUND'));
      }
    })
    .catch(error => {
      next(error);
    });
});

router.post('/:channel_id/:post:id/edit', (req, res, next) => {
  const { id } = req.body;
  res.redirect('channels/:post_id/singlepost');
});

// channel routes
router.get('/', (req, res, next) => {
  Channel.find()
    .then(data => {
      res.render('channels', { data });
    })
    .catch(error => {
      next(error);
    });
});

router.get('/create', (req, res, next) => {
  res.render('channels/create');
});

router.post('/create', uploader.single('picture'), (req, res, next) => {
  const author = req.user._id;

  const { name, description } = req.body;
  const { url } = req.file;
  Channel.create({
    name,
    description,
    picture: url,
    author
  })
    .then(channel => {
      res.redirect(`/channels/${channel._id}`);
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:channel_id', (req, res, next) => {
  const { channel_id } = req.params;
  let channel;
  Channel.findById(channel_id)
    .then(document => {
      if (!document) {
        next(new Error('NOT_FOUND'));
      } else {
        channel = document;
        return Post.find({ channel: channel_id })
          .populate('channels author')
          .limit(50);
      }
    })
    .then(posts => {
      res.render('channels/singleview', { channel, posts });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
