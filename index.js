let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

const express = require('express')
const app = express()
app.use(express.json())

app.get('/api/persons/', (request, response) => {
  response.json(persons)
})

app.get('/info/', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people<p/>
      <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === +id)

  if (person) {
    response.json(person)
  } else {
    return response.status(404).send({ error: 'unknown person id, search valid id' })
  }

})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== +id)
  response.status(204).end()
}) 

const randomId = Math.floor(Math.random()*1000)

app.post('/api/persons', (request, response) => {

  const personArray = persons.map(person => person.name)
  
  if ((!request.body.name) || (!request.body.number)) {
    return response.status(400).send({error: 'body name or number is not set'})
  } else if (personArray.includes(request.body.name)) {
    return response.status(400).send({error: 'name must be unique'})
  } 

  const person = {
    id: randomId, 
    name: request.body.name,
    number: request.body.number
  }  
  persons = persons.concat(person)
  response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running in port: ${PORT}`)
})