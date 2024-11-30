const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const phonebookRouter = require('./controller/phone-book');
const middlewear = require('./utils/middlewear');
const logger = require('./utils/logger');
const moongoose = require('mongoose');

moongoose.set('strictQuery', false);

logger.info(`connecting to ${config.MONGODB_URI}`);

moongoose.connect(config.MONGODB_URI).then(() => {
  logger.info('connected to MongoDB');
}).catch((error) => {
  console.log('error connecting to MongoDB: ', error.message);
})

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(middlewear.requestLogger)

app.use('/api/persons', phonebookRouter);

app.use(middlewear.unknownEndpoint);
app.use(middlewear.errorHandler);

module.exports = app;

