const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const { getCoordForAddress } = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Walter White House',
    description: "One of the most famous drug dealers' house.",
    address: '3828 Piermont Dr NE, Albuquerque, NM 87111',
    image:
      'https://static.independent.co.uk/s3fs-public/thumbnails/image/2016/01/15/15/Breaking-Bad-House.jpg.png?w968h681',
    location: {
      lat: 35.126114,
      lng: -106.536564,
    },
    creator: 'u1',
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError('500 status code, could not the find place!', 500);
    return next(err);
  }

  if (!place) {
    return next(new HttpError('Could not find a place by place ID!', 404));
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (error) {
    return next(new HttpError('Fetching places failed!', 500));
  }

  if (!places || places.length === 0) {
    return next(new HttpError('Could not find places by user ID!', 404));
  }

  res.json({ places: places.map((p) => p.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input passed, please check the input', 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      'https://static.independent.co.uk/s3fs-public/thumbnails/image/2016/01/15/15/Breaking-Bad-House.jpg.png?w968h681',
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(new HttpError('Creating place failed', 500));
  }

  if (!user) {
    return next(new HttpError('Could not find the user', 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await createdPlace.save({ session: sess });

    user.places.push(createdPlace);
    await user.save({ session: sess });

    await sess.commitTransaction();
  } catch (error) {
    return next(new HttpError('Creating place failed!', 500));
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input passed, please check the input', 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError('500, Could not update place', 500));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    return next(new HttpError('500, Could not save place', 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (error) {
    return next(new HttpError('500, Could not find place', 500));
  }

  if (!place) {
    return next(new HttpError('Could not find the place', 404));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await place.remove({ session: sess });

    place.creator.places.pull(place);
    await place.creator.save({ session: sess });

    await sess.commitTransaction();
  } catch (error) {
    return next(new HttpError('500, Could not delete place', 500));
  }

  res.status(200).json({ message: 'Deleted place!' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
