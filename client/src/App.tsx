import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from './store'
import { 
  setTodos, 
  addTodo, 
  toggleTodo, 
  deleteTodo, 
  setLoading, 
  setError,
  selectTodos,
  selectLoading,
  selectError,
  selectCompletedTodos,
  selectPendingTodos
} from './store'

const API_URL = 'http://localhost:4000/todos'

function App() {
  const [text, setText] = useState('')
  const todos = useSelector(selectTodos)
  const loading = useSelector(selectLoading)
  const error = useSelector(selectError)
  const completedCount = useSelector(selectCompletedTodos).length
  const pendingCount = useSelector(selectPendingTodos).length
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        dispatch(setLoading(true))
        dispatch(setError(null))
        const res = await axios.get(API_URL)
        dispatch(setTodos(res.data))
      } catch (err) {
        dispatch(setError('Failed to load todos'))
        console.error('Error fetching todos:', err)
      } finally {
        dispatch(setLoading(false))
      }
    }

    fetchTodos()
  }, [dispatch])

  const handleAdd = async () => {
    if (!text.trim()) return
    
    try {
      dispatch(setLoading(true))
      const res = await axios.post(API_URL, { text })
      dispatch(addTodo(res.data))
      setText('')
    } catch (err) {
      dispatch(setError('Failed to add todo'))
      console.error('Error adding todo:', err)
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleToggle = async (id: number) => {
    try {
      await axios.put(`${API_URL}/${id}`)
      dispatch(toggleTodo(id))
    } catch (err) {
      dispatch(setError('Failed to update todo'))
      console.error('Error updating todo:', err)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      dispatch(deleteTodo(id))
    } catch (err) {
      dispatch(setError('Failed to delete todo'))
      console.error('Error deleting todo:', err)
    }
  }

  if (loading && todos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading todos...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
      <h1 className="text-3xl font-bold mb-6">Todo App</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="flex gap-2 mb-4">
        <input
          className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task..."
          disabled={loading}
        />
        <button
          onClick={handleAdd}
          disabled={loading || !text.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </div>
      
      <div className="mb-4 text-sm text-gray-600">
        {pendingCount} pending, {completedCount} completed
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
              disabled={loading}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      
      {todos.length === 0 && !loading && (
        <div className="mt-4 text-gray-500">No todos yet. Add one above!</div>
      )}
    </div>
  )
}

export default App
