const express = require('express');
const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../../config');

function createRouter(service) {
  const router = express.Router();

  router.get('/', (req, res) => {
    service.getAllUsers()
      .then(response => res.send(response))
      .catch(err => res.status(400).send(err));
  });

  router.get('/me', (req, res) => {
    const { userId } = req;
    
    if (!userId) {
      res.status(400).send({ error: 'Missing userId' });
    } else {
      service
        .getUser(userId)
        .then(response => res.send(response))
        .catch(() => res.status(400).send());
    }

  });

  router.get('/name/:id', (req, res) => {
    const { id } = req.params;

    service
      .getUserName(id)
      .then(response => res.send(response))
      .catch(() => res.status(400).send());
  });

  router.get('/:id', (req, res) => {
    const { id } = req.params;

    service
      .getUser(id)
      .then(response => res.send(response))
      .catch(err => res.status(400).send(err));
  });

  router.post('/login', (req, res) => {
    const { token, platform, ignoreCookie } = req.body;
    const userIsLoggedIn = req.userId;

    if (userIsLoggedIn && !ignoreCookie) {
      res
        .status(204)
        .send();
    } else {
      service
        .login({ token, platform })
        .then(user => {
          res
            .status(200)
            .cookie('chimera_cookie', jwt.sign({ id: user._id }, jwtSecret))
            .send(user);
        })
        .catch(err => res.status(400).send(err));
    }
    
  });
  
  router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    service
      .removeUser(id)
      .then(res => {
        if (res.success) res.status(204).send();
        else res.status(500).send();
      });
  });

  router.post('/friend/accept', (req, res) => {
    const { id } = req.body;

    if (req.userId && id !== req.userId) {
      service.acceptFriendRequest({ userId: req.userId, friendId: id })
        .then(response => res.send(response))
        .catch(err => res.status(400).send({ err }));
    } else {
      res.status(401).send({ err: 'Must be logged in' });
    }
  });
  
  router.post('/friend/send', (req, res) => {
    const { id } = req.body;
    console.log(id, req.userId);
    if (req.userId && id !== req.userId) {
      service.sendFriendRequest({ userId: req.userId, friendId: id })
        .then(response => res.send(response))
        .catch(err => res.status(400).send({ err }));
    } else {
      res.status(401).send({ err: 'Must be logged in' });
    }
    
  });
  
  router.post('/friend/decline', (req, res) => {
    const { id } = req.body;
    if (req.userId && id !== req.userId) {
      service.declineFriendRequest({ userId: req.userId, friendId: id })
        .then(response => res.send(response))
        .catch(err => res.status(400).send({ err }));
    } else {
      res.status(401).send({ err: 'Must be logged in' });
    }
    
  });


  return router;
}

module.exports = createRouter;
