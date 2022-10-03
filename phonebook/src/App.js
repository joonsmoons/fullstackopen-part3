import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Person from './components/Person'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [addMessage, setAddMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons =>
        setPersons(initialPersons)
      )
  }, [])

  // console.log('person length:', persons.length)
  // console.log('persons:', persons)

  const addName = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (persons.map(person => person.name.toLowerCase()).includes(newName.toLowerCase())) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
        // console.log('user said yes')
        const updatePerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
        const changedPerson = { ...updatePerson, number: newNumber }
        personService
          .update(updatePerson.id, changedPerson)
          .then(returnedPerson =>
            setPersons(persons.map(person => updatePerson.id !== person.id ? person : returnedPerson)))
          .catch(() => {
            setErrorMessage(`Information of ${newName} has already been removed from the server.`)
            setTimeout(() => setErrorMessage(null), 5000)
          })
        // console.log(updatePerson.id, updatePerson)
      }
    } else {
      setAddMessage(`Added ${personObject.name} to the phonebook!`)
      setTimeout(() => setAddMessage(null), 5000)
      personService
        .create(personObject)
        .then(returnedPerson => setPersons(persons.concat(returnedPerson)))

    }
    setNewName('')
    setNewNumber('')
  }

  const handleName = event => {
    setNewName(event.target.value)
  }

  const handleNumber = event => {
    setNewNumber(event.target.value)
  }

  const handleFilter = event => {
    setNewFilter(event.target.value)
  }

  const toggleDelete = id => {
    const deletePerson = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${deletePerson.name}?`)) {
      // console.log(deletePerson)
      personService
        .remove(id)
        .then(response => response.body)
        .catch(() => {
          setErrorMessage(`Information of ${newName} has already been removed from the server.`)
          setTimeout(() => setErrorMessage(null), 5000)
        })
      setPersons(persons.filter(person => person.id !== id))
    }
  }

  const addressOutput = persons.filter(person => (
    person.name.toLowerCase().includes(newFilter.toLowerCase()) ? true : false
  ))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} type={'error'}/>
      <Notification message={addMessage} type={'add'}/>
      <Filter newFilter={newFilter} handleFilter={handleFilter} />
      <h2>Add a new address</h2>

      <PersonForm addName={addName} newName={newName} handleName={handleName}
        newNumber={newNumber} handleNumber={handleNumber} />

      <h2>Numbers</h2>
      <ul>
        {addressOutput.map(person => <Person key={person.id} person={person} toggleDelete={() => toggleDelete(person.id)} />)}
      </ul>
    </div>
  )
}

export default App
