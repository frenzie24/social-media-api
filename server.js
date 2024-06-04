const express = require('express');
const db = require('./config/connection');
const routes = require('./routes');
const {log} = require('@frenzie24/logger');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    log(`API server running on port ${PORT}!`);
  });
});
