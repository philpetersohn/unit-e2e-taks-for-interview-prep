import { configureStore, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Todo {
  id: number
  text: string
  completed: boolean
}

interface TodoState {
  items: Todo[]
  loading: boolean
  error: string | null
  lastUpdated: number | null
}

const initialState: TodoState = {
  items: [],
  loading: false,
  error: null,
  lastUpdated: null,
}

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    // Data operations
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.items = action.payload
      state.lastUpdated = Date.now()
      state.error = null
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.items.push(action.payload)
      state.lastUpdated = Date.now()
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.items.find((t) => t.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
        state.lastUpdated = Date.now()
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((t) => t.id !== action.payload)
      state.lastUpdated = Date.now()
    },
    
    // Optimistic updates
    addTodoOptimistic: (state, action: PayloadAction<Todo>) => {
      state.items.push(action.payload)
    },
    updateTodoOptimistic: (state, action: PayloadAction<{ id: number; updates: Partial<Todo> }>) => {
      const todo = state.items.find((t) => t.id === action.payload.id)
      if (todo) {
        Object.assign(todo, action.payload.updates)
      }
    },
  },
})

export const { 
  setTodos, 
  addTodo, 
  toggleTodo, 
  deleteTodo, 
  setLoading, 
  setError,
  addTodoOptimistic,
  updateTodoOptimistic
} = todoSlice.actions

// Selectors
export const selectTodos = (state: RootState) => state.todos.items
export const selectLoading = (state: RootState) => state.todos.loading
export const selectError = (state: RootState) => state.todos.error
export const selectCompletedTodos = (state: RootState) => 
  state.todos.items.filter(todo => todo.completed)
export const selectPendingTodos = (state: RootState) => 
  state.todos.items.filter(todo => !todo.completed)

export const store = configureStore({
  reducer: { todos: todoSlice.reducer },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
