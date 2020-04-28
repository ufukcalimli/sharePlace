const express = require('express');
const bodyParser = require('body-parser');

const HttpError = require('./models/http-error');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');

const PORT = 5000;

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route!', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500).json({ message: error.message || 'Unknown error occurred!' });
});

app.listen(PORT, console.log(`Server running on localhost:${PORT}`));
