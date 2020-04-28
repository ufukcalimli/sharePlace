const express = require('express');

const HttpError = require('../models/http-error');

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Walter White House',
    description: "One of the most famous drug dealers' house.",
    imageUrl:
      'https://static.independent.co.uk/s3fs-public/thumbnails/image/2016/01/15/15/Breaking-Bad-House.jpg.png?w968h681',
    address: '3828 Piermont Dr NE, Albuquerque, NM 87111',
    location: {
      lat: 35.126114,
      lng: -106.536564,
    },
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapper in the world.',
    imageUrl:
      'https://images.cdn.nouveau.nl/62DQRbCr4V05yAFtCrSN_8NXmjk=/890x0/smart/nouveau.nl/s3fs-public/main_media/nouveau-travel-empire-state-building.jpg?itok=_dAIVK7C',
    address: '20 W 34th St, New York, NY 10001',
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: 'u2',
  },
];

router.get('/:pid', (req, res, next) => {
  const placeId = req.params.pid;

  const place = DUMMY_PLACES.find((place) => place.id === placeId);

  if (!place) {
    throw new HttpError('Could not find place by place ID!', 404);
  }

  res.json({ place });
});

router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid;

  const place = DUMMY_PLACES.find((user) => user.creator === userId);

  if (!place) {
    return next(new HttpError('Could not find place by place ID!', 404));
  }

  res.json({ place });
});

module.exports = router;
