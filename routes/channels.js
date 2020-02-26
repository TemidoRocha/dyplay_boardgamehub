'use strict';

const { Router } = require('express');

const router = new Router();
const Post = require('./../models/post');

const Channel = require('./../models/channel');
const Comments = require('./../models/comments');
const uploader = require('./../multer-configure.js');

//comments routes
router.get('/:channel_id/delete', (req, res, next) => {
  const { channel_id } = req.params;
  Channel.findOneAndDelete({
    _id: channel_id,
    author: req.user._id
  })
    .then(() => {
      res.redirect('/channels');
    })
    .catch(error => {
      next(error);
    });
});
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
router.get('/:channel_id/:post_id/:comment_id/delete', (req, res, next) => {
  const { comment_id, channel_id, post_id } = req.params;

  Comments.findByIdAndDelete({
    _id: comment_id,
    author: req.user._id
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

  let url;

  if (req.file) {
    url = req.file.url;
  }

  Post.create({
    title,
    description,
    channel: channel_id,
    author: req.user._id,
    picture: url
  })
    .then(post => {
      res.redirect(`/channels/${channel_id}/${post._id}`);
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
  let url;
  const user = req.user._id;
  let sameUser;
  if (req.file) {
    url = req.file.url;
  }
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
    .then(channel => {
      console.log(channel);
      user.toString() == channel.author._id.toString() ? (sameUser = true) : (sameUser = false);
      console.log(sameUser);
      res.redirect(`/channels/${channel_id}`, channel, sameUser);
    })
    .catch(error => {
      next(error);
    });
});

router.get('/:channel_id/:post_id/delete', (req, res, next) => {
  const { post_id, channel_id } = req.params;

  Post.findOneAndDelete({
    _id: post_id,
    author: req.user._id
  })
    .then(() => {
      res.redirect(`/channels/${channel_id}`);
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

router.post('/:channel_id/:post_id/edit', uploader.single('picture'), (req, res, next) => {
  const { channel_id, post_id } = req.params;
  const { title, description } = req.body;
  let url;

  if (req.file) {
    url = req.file.url;
  }

  Post.findOneAndUpdate(
    {
      _id: post_id,
      author: req.user._id
    },
    {
      title,
      description,
      picture: url
    }
  )
    .then(() => {
      res.redirect(`/channels/${channel_id}/${post_id}`);
    })
    .catch(error => {
      next(error);
    });
});
router.get('/:channel_id/:post_id', (req, res, next) => {
  const { post_id } = req.params;
  const user = req.user._id;
  let sameUser;

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
      user.toString() == post.author._id.toString() ? (sameUser = true) : (sameUser = false);

      res.render('channels/posts/singlepost', { post, comments, sameUser });
    })
    .catch(error => {
      next(error);
    });
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
  let url;

  if (req.file) {
    url = req.file.url;
  }

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
  const user = req.user._id;
  let sameUser;
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
      user.toString() == channel.author.toString() ? (sameUser = true) : (sameUser = false);

      res.render('channels/singleview', { channel, posts, sameUser });
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
