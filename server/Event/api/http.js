const express = require('express');

function createEventRouter(service) {
  const router = express.Router();

  router.post('/create', (req, res) => {
    const { body } = req;
    
    if (!req.userId) {
      res.status(401).send({ error: 'Unauthorized' });
    } else {
      const eventDetails = { ...body, id: req.userId };
      
      service
        .createNewEvent(eventDetails)
        .then(event => res.status(200).send(event))
        .catch(err => res.status(400).send({ err }));
    }
  });

  router.post('/public/attend/:id', (req, res) => {
    if (req.userId) {
      service.toggleAttendancePublicEvent({ userId: req.userId, eventId: req.params.id })
        .then(response => res.status(200).send(response))
        .catch(err => res.status(400).send({ err }));
    } else {
      res.status(401).send({ err: 'You need to be logged in for this action' });
    }
  });

  router.get('/attending/:id', (req, res) => {
    const { id } = req.params;
    
    if (id) {
      service.getAttendingById(id)
        .then(response => res.status(200).send(response))
        .catch(err => res.status(404).send({ err }));
    } else {
      res.status(400).send({ err: 'Must provide user ID' })
    }
  })

  router.get('/myevents',(req, res) => {
    if (req.userId) {
      service.getUserEvents(req.userId)
        .then(response => res.status(200).send(response))
        .catch(err => res.status(400).send({ err }));
    } else {
      res.status(401).send({ err: 'You need to be logged in for this action' });
    }
  });

  router.get('/public/:category', (req, res) => {
    service.getEventByCategory(req.params.category)
      .then(events => res.status(200).send(events))
      .catch(err => res.status(400).send(err))
  });

  router.get('/public', (req, res) => {
    service
      .getPublicEvents()
      .then(events => res.status(200).send(events))
      .catch(err => res.status(400).send(err))
  });

  router.put('/:id', (req, res) => {
    console.log(req.body, req.params.id);
    service
      .updateEvent(req.params.id, req.body)
      .then(changedEvent => res.status(200).send(changedEvent))
      .catch(err => res.status(400).send(err));
  });

  return router;
}

module.exports = createEventRouter;
