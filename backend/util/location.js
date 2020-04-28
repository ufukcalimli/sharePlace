//////////////////////////////////////////////////////////////////////////////////////////////
// TODO: Implementation of Geocoding api in order to receive coordinations by given address //
//////////////////////////////////////////////////////////////////////////////////////////////

async function getCoordForAddress(address) {
  return {
    lat: 35.126114,
    lng: -106.536564,
  }; // dummy result because I have no money to subscribe on google maps
}

exports.getCoordForAddress = getCoordForAddress;
