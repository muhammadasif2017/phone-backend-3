const phonebookRouter = require('express').Router();
const logger = require('../utils/logger');

const PhoneBook = require('../models/phone-book');

phonebookRouter.get('/', (request, response) => {
  PhoneBook.find({}).then((persons) => {
    console.log('persons:', persons);
    response.json(persons);
  });
});

phonebookRouter.get('/info', (request, response) => {
  PhoneBook.find({}).then((persons) => {
    const responseStr = `<div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    </div>`;
    response.send(responseStr);
  });
});

phonebookRouter.get('/:id', (request, response, next) => {
  const id = request.params.id;
  PhoneBook.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

phonebookRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id;

  PhoneBook.findByIdAndDelete(id)
    .then((person) => {
      if (person) {
        response.status(204).end();
      } else {
        response.status(404).send('Person not found');
      }
    })
    .catch((error) => next(error));
});
phonebookRouter.post('/', (request, response, next) => {
  const body = request.body;
  //   if (!body.name || !body.number) {
  //     return response.status(400).json({
  //       error: 'name or number is missing',
  //     });
  //   }
  const person = {
    name: body.name,
    number: body.number,
  };
  const phonebook = new PhoneBook(person);
  phonebook
    .save()
    .then((persons) => {
      logger.info(`added ${person.name} number ${person.number} to phonebook`);
      response.json(persons);
    })
    .catch((error) => next(error));
});

phonebookRouter.put('/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  PhoneBook.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

module.exports = phonebookRouter;