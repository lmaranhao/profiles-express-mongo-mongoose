const mongoose = require('mongoose');
const { Schema } = mongoose;

const mbti = ['INFP', 'INFJ', 'ENFP', 'ENFJ', 'INTJ', 'INTP', 'ENTP', 'ENTJ', 'ISFP', 'ISFJ', 'ESFP', 'ESFJ', 'ISTP', 'ISTJ', 'ESTP', 'ESTJ'];
const enneagram = ['1W2', '2W3', '3W2', '3W4', '4W3', '4W5', '5W4', '5W6', '6W5', '6W7', '7W6', '7W8', '8W7', '8W9', '9W8', '9W1'];
const zodiac = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

const ProfileSchema = Schema({
  id: Number,
  name: String,
  description: String,
  mbti: { type: String, enum: mbti, required: false },
  enneagram: { type: String, enum: enneagram, required: false },
  variant: String,
  tritype: Number,
  socionics: String,
  sloan: String,
  psyche: String,
  temperament: String,
  image: { type: String, default: 'https://soulverse.boo.world/images/1.png' },
}, { timestamps: true });

const UserSchema = new Schema({
  name: String,
  likedComments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

const CommentSchema = new Schema({
  title: String,
  description: String,
  mbti: { type: String, enum: mbti, required: false },
  enneagram: { type: String, enum: enneagram, required: false },
  zodiac: { type: String, enum: zodiac, required: false },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = { ProfileSchema, UserSchema, CommentSchema, mbti, enneagram, zodiac };
