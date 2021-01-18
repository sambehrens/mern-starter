const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const AWS = require('aws-sdk');

AWS.config.apiVersions = {
  ses: '2010-12-01',
  s3: '2006-03-01',
};

AWS.config.region = 'us-west-2';

// MongoDB URI
const mongoURI = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB successfully connected at ' + mongoURI))
  .catch((err) => console.log(err));

// Add the validation error plugin to make the model validation
// errors look nice.
mongoose.plugin(require('./models/plugins/validationError'));

// Add models to mongoose
mongoose.model('User', require('./models/User'));

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize({}));

// Passport config
require('./config/passport')(passport);

app.use(fileUpload());

// Routes
app.use('/api/users', require('./routes/api/users/users'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  //Set static folder
  app.use(express.static('client/build'));

  app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));

module.exports = app;
