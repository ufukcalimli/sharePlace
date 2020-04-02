import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

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

const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
