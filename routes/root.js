'use strict';

const express = require('express');
const router = express.Router();
router.use(express.json());

const Profile = require('../models/profile');
const { mbti, enneagram, zodiac } = require('../models/schemas');

module.exports = function () {

    // GET route for all valid MBTI values
    router.get('/mbti', (req, res) => {
      res.json(mbti);
    });
  
    // GET route for all valid Enneagram values
    router.get('/enneagram', (req, res) => {
      res.json(enneagram);
    });
  
    // GET route for all valid Zodiac values
    router.get('/zodiac', (req, res) => {
      res.json(zodiac);
    });

  router.get('/:id', async (req, res, next) => {
    try {
      const id = req.params.id;
      const profile = await Profile.findById(id);
      if (!profile) {
        return res.status(404).send({ message: 'Profile not found' });
      }
      res.render('profile_template', {
        profile,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  });

  return router;
}

