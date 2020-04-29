const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

let DUMMY_USERS = [
  {
    id: 'u1',
    name: 'kamil',
    email: 'test@test.com',
    password: 'testers',
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(new HttpError('Invalid input passed, please check the input', 422));
  }

  const { name, email, password, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError('500, Signing up failed', 500));
  }

  if (existingUser) {
    return next(new HttpError('422, User already exists!', 422));
  }

  const createdUser = new User({
    name,
    email,
    image: 'imageUrl',
    password,
    places,
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError('500, Signing up failed!', 500));
  }

  res.json(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password === password) {
    throw new HttpError('Could not identify user, credentials seem to be wrong!', 401);
  }

  res.json({ message: 'Logged in' });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
