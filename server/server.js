const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())

const TODOS_FILE = path.join(__dirname, 'todos.json')

// Load todos from file or initialize empty array
let todos = []
try {
  if (fs.existsSync(TODOS_FILE)) {
    todos = JSON.parse(fs.readFileSync(TODOS_FILE, 'utf8'))
  }
} catch (error) {
  console.error('Error loading todos:', error)
}

// Helper function to save todos to file
const saveTodos = () => {
  try {
    fs.writeFileSync(TODOS_FILE, JSON.stringify(todos, null, 2))
  } catch (error) {
    console.error('Error saving todos:', error)
  }
}

app.get('/todos', (req, res) => {
  res.json(todos)
})

app.post('/todos', (req, res) => {
  const { text } = req.body
  const newTodo = { id: Date.now(), text, completed: false }
  todos.push(newTodo)
  saveTodos()
  res.status(201).json(newTodo)
})

app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const todo = todos.find((t) => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
    saveTodos()
    res.json(todo)
  } else {
    res.status(404).json({ message: 'Todo not found' })
  }
})

app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id)
  todos = todos.filter((t) => t.id !== id)
  saveTodos()
  res.status(204).end()
})

app.listen(4000, () => {
  console.log('API running on http://localhost:4000')
})
