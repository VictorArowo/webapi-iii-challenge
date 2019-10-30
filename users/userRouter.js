const express = require('express');

const router = express.Router();

const userDb = require('./userDb');
const postDb = require('../posts/postDb');

router.post('/', validateUser, (req, res) => {
  userDb
    .insert(req.body)
    .then(user => {
      return res.status(201).json(user);
    })
    .catch(() => {
      res.status(500).json({ message: 'The users could not be created' });
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  postDb
    .insert({
      ...req.body,
      user_id: req.params.id
    })
    .then(post => {
      return res.status(201).json(post);
    })
    .catch(() => {
      res.status(500).json({ message: 'The post could not be created' });
    });
});

router.get('/', (req, res) => {
  userDb
    .get()
    .then(users => {
      return res.status(200).json(users);
    })
    .catch(() => {
      return res
        .status(500)
        .json({ message: 'The users could not be retrieved' });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  return res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  userDb
    .getUserPosts(req.user.id)
    .then(posts => {
      if (posts) {
        return res.status(200).json(posts);
      }
      return res
        .status(404)
        .json({ message: `No posts by that user could be found` });
    })
    .catch(() => {
      return res
        .status(500)
        .json({ message: 'The posts could not be retrieved' });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  userDb
    .remove(req.params.id)
    .then(user => {
      if (user) {
        return res.status(200).json(req.user);
      }
      return res.status(500).json({ message: 'The user could not be deleted' });
    })
    .catch(() => {
      return res.status(500).json({ message: 'The user could not be deleted' });
    });
});

router.put('/:id', validateUserId, (req, res) => {
  const { name } = req.body;

  userDb
    .update(req.params.id, { name })
    .then(user => {
      if (user) {
        return res.status(200).json(user);
      }
      return res.status(500).json({ message: 'The user could not be updated' });
    })
    .catch(() => {
      return res.status(500).json({ message: 'The user could not be updated' });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  if (Number(id) == id) {
    userDb
      .getById(id)
      .then(user => {
        if (user) {
          req.user = user;
          next();
        } else {
          return res.status(404).json({ message: 'Invalid user ID' });
        }
      })
      .catch(err => {
        return res
          .status(500)
          .json({ message: `The user could not be retrieved: ${err}` });
      });
  } else {
    return res.status(400).json({ message: `Your ID is garbage` });
  }
}

function validateUser(req, res, next) {
  const { name } = req.body;

  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: 'missing user data' });
  }
  if (!name) {
    return res.status(400).json({ message: 'missing required name field' });
  }
  next();
}

function validatePost(req, res, next) {
  const { text } = req.body;

  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: 'missing post data' });
  }
  if (!text) {
    return res.status(400).json({ message: 'missing required text field' });
  }
  next();
}

module.exports = router;
