import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from './store'
import { setTodos, addTodo, toggleTodo, deleteTodo } from './store'

const API_URL = 'http://localhost:4000/todos'

function App() {
  const [text, setText] = useState('')
  const todos = useSelector((state: RootState) => state.todos)
  const dispatch = useDispatch()

  useEffect(() => {
    axios.get(API_URL).then((res) => dispatch(setTodos(res.data)))
  }, [dispatch])

  const handleAdd = async () => {
    if (!text.trim()) return
    const res = await axios.post(API_URL, { text })
    dispatch(addTodo(res.data))
    setText('')
  }

  const handleToggle = async (id: number) => {
    await axios.put(`${API_URL}/${id}`)
    dispatch(toggleTodo(id))
  }

  const handleDelete = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`)
    dispatch(deleteTodo(id))
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
      <h1 className="text-3xl font-bold mb-6">Todo App</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task..."
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add
        </button>
      </div>
      <ul className="w-full max-w-md bg-white rounded-md shadow divide-y divide-gray-200">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center px-4 py-2 hover:bg-gray-50"
          >
            <span
              onClick={() => handleToggle(todo.id)}
              className={`cursor-pointer ${
                todo.completed ? 'line-through text-gray-400' : ''
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => handleDelete(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
