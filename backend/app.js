const express = require('express');
const bodyParser = require('body-parser');

const placesRoutes = require('./routes/places-routes');

const PORT = 5000;

const app = express();

app.use('/api/places', placesRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500).json({ message: error.message || 'Unknown error occurred!' });
});

app.listen(PORT, console.log(`Server running on localhost:${PORT}`));
