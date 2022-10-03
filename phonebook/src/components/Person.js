const Person = ({ person, toggleDelete }) => <li>{person.name} {person.number} <button onClick={toggleDelete}>delete</button></li>

export default Person