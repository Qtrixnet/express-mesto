const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use((req, res, next) => {
  req.user = {
    _id: '60617ed3ec53713071be52ae',
  };

  next();
});
const router = require('./routes');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(router);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
