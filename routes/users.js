'use strict';

const express = require('express');
const router = express.Router();
router.use(express.json());

const User = require('../models/user');

module.exports = function () {

  router.post('/', async (req, res) => {
    try {
      const user = new User(req.body);
      const userCreated = await user.save();
      res.status(201).send(userCreated);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id).exec();
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}