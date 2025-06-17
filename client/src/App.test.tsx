import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'
import axios from 'axios'

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('App Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks()
    
    // Mock initial todos fetch
    vi.mocked(axios.get).mockResolvedValue({ data: [] })
  })

  const renderApp = () => {
    return render(
      <Provider store={store}>
        <App />
      </Provider>
    )
  }

  it('renders the todo app title', async () => {
    renderApp()
    await waitFor(() => {
      expect(screen.getByText('Todo App')).toBeInTheDocument()
    })
  })

  it('allows adding a new todo', async () => {
    const mockTodo = { id: 1, text: 'New Task', completed: false }
    vi.mocked(axios.post).mockResolvedValue({ data: mockTodo })
    
    renderApp()
    
    const input = screen.getByPlaceholderText('Add a task...')
    const addButton = screen.getByText('Add')

    fireEvent.change(input, { target: { value: 'New Task' } })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument()
    })
  })

  it('does not add empty todos', async () => {
    renderApp()
    
    const input = screen.getByPlaceholderText('Add a task...')
    const addButton = screen.getByText('Add')

    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(addButton)

    expect(axios.post).not.toHaveBeenCalled()
  })

  it('handles API errors when fetching todos', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Failed to fetch'))
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByText('Todo App')).toBeInTheDocument()
    })
  })

  it('allows toggling a todo', async () => {
    const mockTodo = { id: 1, text: 'Toggle Task', completed: false }
    vi.mocked(axios.get).mockResolvedValue({ data: [mockTodo] })
    vi.mocked(axios.put).mockResolvedValue({ data: {} })
    
    renderApp()
    
    await waitFor(() => {
      expect(screen.getByText('Toggle Task')).toBeInTheDocument()
    })

    const todoText = screen.getByText('Toggle Task')
    fireEvent.click(todoText)

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('http://localhost:4000/todos/1')
    })
  })

  it('allows deleting a todo', async () => {
    // Mock initial todos with one item
    const mockTodo = { id: 1, text: 'Task to Delete', completed: false }
    vi.mocked(axios.get).mockResolvedValue({ data: [mockTodo] })
    vi.mocked(axios.delete).mockResolvedValue({ data: {} })
    
    renderApp()
    
    // Wait for the todo to appear
    await waitFor(() => {
      expect(screen.getByText('Task to Delete')).toBeInTheDocument()
    })

    // Find and click delete button
    const deleteButton = screen.getByText('×')
    fireEvent.click(deleteButton)

    // Verify task is removed
    await waitFor(() => {
      expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument()
    })
  })

  it('handles API errors when adding a todo', async () => {
    vi.mocked(axios.post).mockRejectedValue(new Error('Failed to add'))
    
    renderApp()
    
    const input = screen.getByPlaceholderText('Add a task...')
    const addButton = screen.getByText('Add')

    fireEvent.change(input, { target: { value: 'New Task' } })
    fireEvent.click(addButton)

    await waitFor(() => {
      expect(screen.queryByText('New Task')).not.toBeInTheDocument()
    })
  })
}) 