'use strict';

const express = require('express');
const router = express.Router();
router.use(express.json());

const Comment = require('../models/comment');
const User = require('../models/user');
const Profile = require('../models/profile');

module.exports = function () {

  router.post('/', async (req, res) => {
    try {
      const { userId, profileId, title, description, mbti, enneagram, zodiac } = req.body;

      // Find the user and the profile in the database
      const user = await User.findById(userId);
      const profile = await Profile.findById(profileId);

      if (!user || !profile) {
        return res.status(404).send({ message: 'User or profile not found' });
      }

      // Create a new comment
      const comment = new Comment({
        title,
        description,
        mbti,
        enneagram,
        zodiac,
        user: userId,
        profile: profileId
      });

      // Save the comment
      await comment.save();

      // Send the created comment
      res.status(201).send(comment);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.post('/like', async (req, res) => {
    try {
      const { commentId, userId } = req.body;

      // Find the comment and the user in the database
      const comment = await Comment.findById(commentId);
      const user = await User.findById(userId);

      if (!comment || !user) {
        return res.status(404).send({ message: 'Comment or user not found' });
      }

      // Check if the user has already liked the comment
      const userIndex = comment.likes.indexOf(userId);
      if (userIndex === -1) {
        // If the user hasn't liked the comment, add their ID to the likes array
        comment.likes.push(userId);
      } else {
        // If the user has already liked the comment, remove their ID from the likes array
        comment.likes.splice(userIndex, 1);
      }

      // Save the comment
      await comment.save();

      // Send the updated comment
      res.status(200).send(comment);
    } catch (error) {
      res.status(400).send(error);
    }
  });

  router.get('/:profileId', async (req, res) => {
    const { profileId } = req.params;
    const { mbti, enneagram, zodiac, sort = 'recent', limit = 10, page = 1 } = req.query;

    // Default sort is by recent
    let sortQuery = { createdAt: -1 }; // -1 for descending order

    if (sort === 'likes') {
      sortQuery = { likes: -1 }; // sort by most likes
    }

    // Default pagination values
    const resultsPerPage = parseInt(limit);
    const offset = page > 1 ? (page - 1) * resultsPerPage : 0;

    // Filter query
    const filterQuery = { profile: profileId };
    if (mbti) filterQuery.mbti = mbti;
    if (enneagram) filterQuery.enneagram = enneagram;
    if (zodiac) filterQuery.zodiac = zodiac;

    try {
      const comments = await Comment.find(filterQuery)
        .sort(sortQuery)
        .limit(resultsPerPage)
        .skip(offset)
        .exec();

      res.json(comments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}