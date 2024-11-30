require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(express.json());

const PhoneBook = require("./models/phone-book");

const cors = require("cors");
app.use(cors());
app.use(express.static("dist"));
morgan.token("req-body", (req) => {
  return req.body && Object.keys(req.body).length
    ? JSON.stringify(req.body)
    : "No Body";
});
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens["req-body"](req, res),
    ].join(" ");
  })
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  PhoneBook.find({}).then((persons) => {
    console.log("persons:", persons);
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  PhoneBook.find({}).then((persons) => {
    const responseStr = `<div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    </div>`;
    response.send(responseStr);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
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

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  // console.log(person);

  PhoneBook.findByIdAndDelete(id)
    .then((person) => {
      if (person) {
        response.status(204).end();
      } else {
        response.status(404).send("Person not found");
      }
    })
    .catch((error) => next(error));
});

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
};
app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log(body);
  // const id = Math.random(0, 1010100101);
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }
  // if (persons.find((person) => person.name === body.name)) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
  // }
  const person = {
    name: body.name,
    number: body.number,
    // id: generateId(),
  };
  // persons = persons.concat(person);
  const phonebook = new PhoneBook(person);
  phonebook.save().then((persons) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    response.json(persons);
  });
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  PhoneBook.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error));
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted  id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
