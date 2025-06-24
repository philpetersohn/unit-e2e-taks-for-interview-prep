# Testing Guide: React Testing Library & Unit Tests

## Overview

This project uses **Vitest** as the test runner with **React Testing Library** for component testing. The testing setup includes both unit tests and integration tests.

## Testing Stack

- **Vitest**: Fast test runner (replacement for Jest)
- **React Testing Library**: Component testing utilities
- **jsdom**: DOM environment for testing
- **@testing-library/jest-dom**: Custom matchers for DOM assertions

## What is Tested with React Testing Library

React Testing Library focuses on **user behavior** and **component integration** rather than implementation details.

### 1. **App Component Tests** (`App.test.tsx`)

#### User Interactions Tested:
```typescript
// ✅ Adding todos
it('allows adding a new todo', async () => {
  const input = screen.getByPlaceholderText('Add a task...')
  const addButton = screen.getByText('Add')
  
  fireEvent.change(input, { target: { value: 'New Task' } })
  fireEvent.click(addButton)
  
  await waitFor(() => {
    expect(screen.getByText('New Task')).toBeInTheDocument()
  })
})

// ✅ Toggling todos
it('allows toggling a todo', async () => {
  const todoText = screen.getByText('Toggle Task')
  fireEvent.click(todoText)
  
  await waitFor(() => {
    expect(axios.put).toHaveBeenCalledWith('http://localhost:4000/todos/1')
  })
})

// ✅ Deleting todos
it('allows deleting a todo', async () => {
  const deleteButton = screen.getByText('×')
  fireEvent.click(deleteButton)
  
  await waitFor(() => {
    expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument()
  })
})
```

#### Business Logic Tested:
```typescript
// ✅ Form validation
it('does not add empty todos', async () => {
  fireEvent.change(input, { target: { value: '   ' } })
  fireEvent.click(addButton)
  
  expect(axios.post).not.toHaveBeenCalled()
})

// ✅ Error handling
it('handles API errors when fetching todos', async () => {
  vi.mocked(axios.get).mockRejectedValue(new Error('Failed to fetch'))
  
  renderApp()
  
  await waitFor(() => {
    expect(screen.getByText('Todo App')).toBeInTheDocument()
  })
})
```

#### UI Rendering Tested:
```typescript
// ✅ Component rendering
it('renders the todo app title', async () => {
  renderApp()
  await waitFor(() => {
    expect(screen.getByText('Todo App')).toBeInTheDocument()
  })
})
```

### 2. **Redux Store Tests** (`store.test.ts`)

These are **pure unit tests** for Redux logic:

```typescript
// ✅ State management
it('should handle setTodos', () => {
  const todos = [
    { id: 1, text: 'Test 1', completed: false },
    { id: 2, text: 'Test 2', completed: true }
  ]
  store.dispatch(setTodos(todos))
  expect(store.getState().todos).toEqual(todos)
})

// ✅ Action reducers
it('should handle toggleTodo', () => {
  const todo = { id: 4, text: 'Toggle Test', completed: false }
  store.dispatch(addTodo(todo))
  
  store.dispatch(toggleTodo(4))
  expect(store.getState().todos.find(t => t.id === 4)?.completed).toBe(true)
})

// ✅ Edge cases
it('should handle toggleTodo for non-existent todo', () => {
  const initialState = store.getState().todos
  store.dispatch(toggleTodo(999))
  expect(store.getState().todos).toEqual(initialState)
})
```

### 3. **App Initialization Tests** (`main.test.tsx`)

Integration test for app startup:

```typescript
it('renders the app without crashing', () => {
  const { container } = render(
    <Provider store={store}>
      <App />
    </Provider>
  )
  expect(container).toBeTruthy()
})
```

## What Constitutes a Unit Test in This Project

### **Pure Unit Tests** (Isolated Logic)
- **Redux reducers**: Testing state transformations in isolation
- **Utility functions**: Pure functions with no side effects
- **Selectors**: Testing computed state logic

### **Component Unit Tests** (With Dependencies)
- **Individual components**: Testing component behavior in isolation
- **Custom hooks**: Testing hook logic with mocked dependencies
- **Form validation**: Testing validation logic

### **Integration Tests** (Multiple Units)
- **Component + Redux**: Testing component with real Redux store
- **API integration**: Testing component with mocked API calls
- **User workflows**: Testing complete user interactions

## Testing Patterns Used

### 1. **Mocking External Dependencies**
```typescript
// Mock axios for API calls
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))
```

### 2. **Test Setup and Cleanup**
```typescript
beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(axios.get).mockResolvedValue({ data: [] })
})
```

### 3. **Async Testing with waitFor**
```typescript
await waitFor(() => {
  expect(screen.getByText('New Task')).toBeInTheDocument()
})
```

### 4. **User-Centric Testing**
```typescript
// Test what user sees and does, not implementation
const input = screen.getByPlaceholderText('Add a task...')
const addButton = screen.getByText('Add')
fireEvent.change(input, { target: { value: 'New Task' } })
fireEvent.click(addButton)
```

## Test Categories in Your Project

### **React Testing Library Tests** (Integration/Component Tests)
- `App.test.tsx`: User interactions, API integration, error handling
- `main.test.tsx`: App initialization

### **Unit Tests**
- `store.test.ts`: Redux state management, reducers, actions

### **E2E Tests** (Cypress)
- `task-management.cy.ts`: Full user workflows in browser

## Best Practices Demonstrated

### ✅ **Good Testing Practices**
1. **User-centric**: Tests focus on user behavior, not implementation
2. **Accessible**: Uses semantic queries (getByText, getByPlaceholderText)
3. **Isolated**: Each test is independent with proper setup/cleanup
4. **Realistic**: Tests real user interactions (click, type, submit)
5. **Error handling**: Tests both success and failure scenarios

### ✅ **Test Organization**
```typescript
describe('App Component', () => {
  beforeEach(() => {
    // Setup
  })

  it('renders the todo app title', () => {
    // Test
  })

  it('allows adding a new todo', () => {
    // Test
  })
})
```

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test App.test.tsx
```

## Coverage Report

The project generates coverage reports showing:
- **Statements**: Percentage of code statements executed
- **Branches**: Percentage of conditional branches tested
- **Functions**: Percentage of functions called
- **Lines**: Percentage of lines executed

## What's Missing (Potential Improvements)

### **Additional Unit Tests**
```typescript
// Custom hooks
describe('useTodos', () => {
  it('should fetch todos on mount', () => {})
  it('should handle loading states', () => {})
  it('should handle error states', () => {})
})

// Utility functions
describe('todoUtils', () => {
  it('should filter completed todos', () => {})
  it('should sort todos by date', () => {})
})
```

### **Component Tests**
```typescript
// Individual components
describe('TodoItem', () => {
  it('should render todo text', () => {})
  it('should show completed state', () => {})
  it('should call onToggle when clicked', () => {})
})
```

### **Redux Selector Tests**
```typescript
describe('todoSelectors', () => {
  it('should select completed todos', () => {})
  it('should select pending todos', () => {})
  it('should calculate todo statistics', () => {})
})
```

## Summary

- **React Testing Library**: Tests user behavior, component integration, and real user interactions
- **Unit Tests**: Test isolated logic (Redux reducers, utilities, selectors)
- **Integration Tests**: Test component + Redux + API interactions
- **E2E Tests**: Test complete user workflows in real browser

The testing approach focuses on **user behavior** rather than implementation details, making tests more maintainable and valuable. 