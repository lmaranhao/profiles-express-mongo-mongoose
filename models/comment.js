const mongoose = require('mongoose');
const { CommentSchema } = require('./schemas');

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;