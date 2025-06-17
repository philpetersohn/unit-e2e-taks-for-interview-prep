import { describe, it, expect } from 'vitest'
import { store } from './store'
import { setTodos, addTodo, toggleTodo, deleteTodo } from './store'

describe('Todo Store', () => {
  it('should handle initial state', () => {
    const state = store.getState()
    expect(state.todos).toEqual([])
  })

  it('should handle setTodos', () => {
    const todos = [
      { id: 1, text: 'Test 1', completed: false },
      { id: 2, text: 'Test 2', completed: true }
    ]
    store.dispatch(setTodos(todos))
    expect(store.getState().todos).toEqual(todos)
  })

  it('should handle addTodo', () => {
    const todo = { id: 3, text: 'New Todo', completed: false }
    store.dispatch(addTodo(todo))
    expect(store.getState().todos).toContainEqual(todo)
  })

  it('should handle toggleTodo', () => {
    // First add a todo
    const todo = { id: 4, text: 'Toggle Test', completed: false }
    store.dispatch(addTodo(todo))
    
    // Then toggle it
    store.dispatch(toggleTodo(4))
    expect(store.getState().todos.find(t => t.id === 4)?.completed).toBe(true)
    
    // Toggle it back
    store.dispatch(toggleTodo(4))
    expect(store.getState().todos.find(t => t.id === 4)?.completed).toBe(false)
  })

  it('should handle deleteTodo', () => {
    // First add a todo
    const todo = { id: 5, text: 'Delete Test', completed: false }
    store.dispatch(addTodo(todo))
    
    // Then delete it
    store.dispatch(deleteTodo(5))
    expect(store.getState().todos.find(t => t.id === 5)).toBeUndefined()
  })

  it('should handle toggleTodo for non-existent todo', () => {
    const initialState = store.getState().todos
    store.dispatch(toggleTodo(999))
    expect(store.getState().todos).toEqual(initialState)
  })
}) 