const express = require("express");
const app = express();
const morgan = require("morgan");
const { request } = require("express");

app.use(express.json());

morgan.token("body", function (req, res) {
    if (req.method === "POST") {
        return JSON.stringify(req.body);
    }
});

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :body"
    )
);

let persons = [
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 4 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 2 },
];

app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.get("/api/info", (req, res) => {
    const currentLength = persons.length;
    res.send(
        `<div>Phonebook has info for ${currentLength} people</div><div>${new Date()}</div>`
    );
});

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find((person) => person.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).send({ error: "no content" });
    }
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter((person) => person.id !== id);
    res.status(204).end();
});

app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: "name or number is missing",
        });
    }
    if (persons.find((person) => person.name === body.name)) {
        return res.status(400).json({
            error: "name is already in the database",
        });
    }
    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * 101121345),
    };
    persons = persons.concat(person);
    res.status(201).json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
