const request = require('supertest');
const startServer = require('../app');
const { mbti, enneagram, zodiac } = require('../models/schemas');
const mongoose = require('mongoose');
const User = require('../models/user');
const Profile = require('../models/profile');
const Comment = require('../models/comment');

let server;

beforeAll(async () => {
  server = await startServer(); // start the server and get the server instance
});

afterAll(async () => {
  await server.close(); // close the server after tests
  await mongoose.connection.close(); // close the Mongoose connection
});

describe('GET /mbti', () => {
  it('should get all MBTI values', async () => {
    const res = await request(server).get('/mbti');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mbti);
  });
});

describe('GET /enneagram', () => {
  it('should get all Enneagram values', async () => {
    const res = await request(server).get('/enneagram');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(enneagram);
  });
});

describe('GET /zodiac', () => {
  it('should get all Zodiac values', async () => {
    const res = await request(server).get('/zodiac');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(zodiac);
  });
});

describe('POST /users', () => {
  let user;
  
  afterEach(async () => {
    if (user) {
      await User.findByIdAndDelete(user._id);
    }
  });

  it('should create a new user', async () => {
    const userData = {
      name: 'Test User',
    };

    const res = await request(server).post('/users').send(userData);
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toEqual(userData.name);

    user = res.body;
  });
});

describe('GET /users/:id', () => {
  let user;

  beforeEach(async () => {
    user = new User({ name: 'Test User' });
    user = await user.save();
  });

  afterEach(async () => {
    if (user) {
      await User.findByIdAndDelete(user._id);
    }
  });

  it('should get a user by id', async () => {
    const res = await request(server).get(`/users/${user._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual(user.name);
  });
});

describe('POST /profiles', () => {
  let profile;
  
  afterEach(async () => {
    if (profile) {
      await Profile.findByIdAndDelete(profile._id);
    }
  });

  it('should create a new profile', async () => {
    const profileData = {
      name: "Leo Musk",
      description: "Elon Reeve Musk FRS",
      mbti: "INTP",
      enneagram: "5W6",
      variant: "sp/so",
      tritype: 513,
      socionics: "ILE",
      sloan: "RCOEI",
      psyche: "VLFE",
      image: "https://soulverse.boo.world/images/1.png"
    };

    const res = await request(server).post('/profiles').send(profileData);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toMatchObject(profileData);

    profile = res.body;
  });
});

describe('GET /profiles/:id', () => {
  let profile;

  beforeEach(async () => {
    profile = new Profile({
      name: "Leo Musk",
      description: "Elon Reeve Musk FRS",
      mbti: "INTP",
      enneagram: "5W6",
      variant: "sp/so",
      tritype: 513,
      socionics: "ILE",
      sloan: "RCOEI",
      psyche: "VLFE",
      image: "https://soulverse.boo.world/images/1.png"
    });
    profile = await profile.save();
  });

  afterEach(async () => {
    if (profile) {
      await Profile.findByIdAndDelete(profile._id);
    }
  });

  it('should get a profile by id', async () => {
    const res = await request(server).get(`/profiles/${profile._id}`);
    expect(res.statusCode).toEqual(200);
    const expectedProfile = profile.toObject();
    expectedProfile._id = expectedProfile._id.toString(); // convert _id to string
    expectedProfile.createdAt = expectedProfile.createdAt.toISOString();
    expectedProfile.updatedAt = expectedProfile.updatedAt.toISOString();
    expect(res.body).toMatchObject(expectedProfile); // this checks that the response body matches the profile we created
  });
});

describe('POST /comments', () => {
  let user, profile, comment;
  
  beforeEach(async () => {
    user = new User({ name: 'Test User' });
    await user.save();

    profile = new Profile({
      name: "Leo Musk",
      description: "Elon Reeve Musk FRS",
      mbti: "INTP",
      enneagram: "5W6",
      variant: "sp/so",
      tritype: 513,
      socionics: "ILE",
      sloan: "RCOEI",
      psyche: "VLFE",
      image: "https://soulverse.boo.world/images/1.png"
    });
    await profile.save();
  });

  afterEach(async () => {
    if (user) {
      await User.findByIdAndDelete(user._id);
    }
    if (profile) {
      await Profile.findByIdAndDelete(profile._id);
    }
    if (comment) {
      await Comment.findByIdAndDelete(comment._id);
    }
  });

  it('should create a new comment', async () => {
    let commentData = {
      userId: user._id.toString(),
      profileId: profile._id.toString(),
      title: 'Test Comment',
      description: 'This is a test comment',
      mbti: 'INTP',
      enneagram: '5W6',
      zodiac: 'Aries'
    };

    const res = await request(server).post('/comments').send(commentData);
    expect(res.statusCode).toEqual(201);
    const expectedComment = res.body;
    expectedComment.profileId = res.body.profile;
    expectedComment.userId = res.body.user;
    delete expectedComment.profile;
    delete expectedComment.user;

    expect(expectedComment).toMatchObject(commentData);

    comment = res.body;
  });
});

describe('POST /comments/like', () => {
  let user, comment;

  beforeEach(async () => {
    user = new User({ name: 'Test User' });
    await user.save();

    comment = new Comment({ title: 'Test Comment', user: user._id });
    await comment.save();
  });

  afterEach(async () => {
    if (user) {
      await User.findByIdAndDelete(user._id);
    }
    if (comment) {
      await Comment.findByIdAndDelete(comment._id);
    }
  });

  it('should like/unlike a comment', async () => {
    const likeData = {
      commentId: comment._id,
      userId: user._id
    };

    let res = await request(server).post('/comments/like').send(likeData);
    expect(res.statusCode).toEqual(200);
    expect(res.body.likes).toContainEqual(user._id.toString());

    res = await request(server).post('/comments/like').send(likeData);
    expect(res.statusCode).toEqual(200);
    expect(res.body.likes).not.toContainEqual(user._id.toString());
  });
});

describe('GET /comments/:profileId', () => {
  let profile, comment;

  beforeEach(async () => {
    profile = new Profile({
      name: "Leo Musk",
      description: "Elon Reeve Musk FRS",
      mbti: "INTP",
      enneagram: "5W6",
      variant: "sp/so",
      tritype: 513,
      socionics: "ILE",
      sloan: "RCOEI",
      psyche: "VLFE",
      image: "https://soulverse.boo.world/images/1.png"
    });
    await profile.save();

    comment = new Comment({ title: 'Test Comment', profile: profile._id });
    await comment.save();
  });

  afterEach(async () => {
    if (profile) {
      await Profile.findByIdAndDelete(profile._id);
    }
    if (comment) {
      await Comment.findByIdAndDelete(comment._id);
    }
  });

  it('should get comments by profile id', async () => {
    const res = await request(server).get(`/comments/${profile._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toContainEqual(expect.objectContaining({ _id: comment._id.toString() }));
  });
});
