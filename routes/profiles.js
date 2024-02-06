'use strict';

const express = require('express');
const router = express.Router();
router.use(express.json());

const Profile = require('../models/profile');

module.exports = function () {

  router.post('/', async (req, res) => {
    try {
      const profile = new Profile(req.body);
      const profileCreated = await profile.save();
      res.status(201).send(profileCreated);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const profile = await Profile.findById(id);
      if (!profile) {
        return res.status(404).send({ message: 'Profile not found' });
      }
      res.send(profile);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  return router;
}

