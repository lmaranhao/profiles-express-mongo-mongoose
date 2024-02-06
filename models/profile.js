const mongoose = require('mongoose');
const { ProfileSchema } = require('./schemas');

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;