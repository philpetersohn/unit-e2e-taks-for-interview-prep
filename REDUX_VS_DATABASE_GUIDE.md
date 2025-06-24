# Redux vs Database/Document Storage: Decision Guide

## Overview

This guide explains how to decide what data goes in Redux (client-side state) versus what gets stored in databases or documents (persistent storage).

## Decision Framework

### 🎯 **What Goes in Redux (Client-Side State)**

#### 1. **UI State & Temporary Data**
```typescript
// Form inputs and temporary user input
const [formData, setFormData] = useState({ name: '', email: '' })

// Loading states
const [isLoading, setIsLoading] = useState(false)
const [isSubmitting, setIsSubmitting] = useState(false)

// Error states
const [error, setError] = useState(null)
const [validationErrors, setValidationErrors] = useState({})

// UI state
const [isModalOpen, setIsModalOpen] = useState(false)
const [selectedTab, setSelectedTab] = useState('home')
const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
```

#### 2. **Cached/Computed Data**
```typescript
// Data fetched from API (cached in Redux)
const todos = useSelector(selectTodos)

// Derived/computed state
const completedTodos = useSelector(selectCompletedTodos)
const pendingTodos = useSelector(selectPendingTodos)
const todoStats = useSelector(selectTodoStats)

// User preferences (session-specific)
const [theme, setTheme] = useState('light')
const [language, setLanguage] = useState('en')
```

#### 3. **Application State**
```typescript
// Navigation state
const [currentRoute, setCurrentRoute] = useState('/')
const [breadcrumbs, setBreadcrumbs] = useState([])

// Authentication state
const [user, setUser] = useState(null)
const [token, setToken] = useState(null)

// Real-time data
const [notifications, setNotifications] = useState([])
const [onlineUsers, setOnlineUsers] = useState([])
```

### 💾 **What Goes in Database/Documents**

#### 1. **Persistent Business Data**
```typescript
// User accounts and profiles
interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  preferences: UserPreferences
}

// Core business entities
interface Todo {
  id: string
  text: string
  completed: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
}

// Relationships and references
interface Project {
  id: string
  name: string
  members: string[] // User IDs
  todos: string[] // Todo IDs
}
```

#### 2. **Configuration & Settings**
```typescript
// User preferences that should persist
interface UserPreferences {
  theme: 'light' | 'dark'
  language: string
  notifications: NotificationSettings
  privacy: PrivacySettings
}

// Application configuration
interface AppConfig {
  featureFlags: Record<string, boolean>
  limits: {
    maxTodos: number
    maxProjects: number
  }
  integrations: IntegrationConfig[]
}
```

#### 3. **Analytics & Metrics**
```typescript
// Usage statistics
interface UserActivity {
  userId: string
  action: string
  timestamp: Date
  metadata: Record<string, any>
}

// Business metrics
interface TodoMetrics {
  totalCreated: number
  totalCompleted: number
  averageCompletionTime: number
  productivityScore: number
}
```

## Decision Rules

### ✅ **Put in Redux if:**
- Data is temporary or session-specific
- Data is derived/computed from other data
- Data is UI state (loading, errors, form inputs)
- Data needs to be shared across multiple components
- Data changes frequently and affects UI immediately
- Data is cached from API responses

### ✅ **Put in Database if:**
- Data needs to persist across sessions
- Data is core business logic/entities
- Data needs to be shared across users
- Data requires backup and recovery
- Data needs to be queried or analyzed
- Data has relationships with other entities

## Examples from Your Todo App

### Current Implementation (Good!)
```typescript
// ✅ Redux: Cached API data
const todos = useSelector(selectTodos)

// ✅ Redux: Loading states
const loading = useSelector(selectLoading)
const error = useSelector(selectError)

// ✅ Local state: Form input (temporary)
const [text, setText] = useState('')

// ✅ Database: Persistent todos
// Stored in server/todos.json
```

### Enhanced Implementation
```typescript
// ✅ Redux: Derived state
const completedCount = useSelector(selectCompletedTodos).length
const pendingCount = useSelector(selectPendingTodos).length

// ✅ Redux: UI state
const [filter, setFilter] = useState('all') // 'all' | 'pending' | 'completed'
const [sortBy, setSortBy] = useState('created') // 'created' | 'text' | 'completed'

// ✅ Database: User preferences
interface UserPreferences {
  defaultFilter: string
  defaultSort: string
  theme: 'light' | 'dark'
  notifications: boolean
}
```

## Best Practices

### 1. **Single Source of Truth**
- Keep one authoritative source for each piece of data
- Redux for UI state, database for persistent data
- Avoid duplicating data between Redux and database

### 2. **Optimistic Updates**
```typescript
// Update Redux immediately for better UX
dispatch(addTodoOptimistic(newTodo))

// Then sync with database
try {
  const response = await api.createTodo(newTodo)
  dispatch(addTodo(response.data))
} catch (error) {
  // Rollback optimistic update
  dispatch(removeTodo(newTodo.id))
}
```

### 3. **Selective Persistence**
```typescript
// Don't persist everything to Redux
const [tempFormData, setTempFormData] = useState({}) // Local state
const [userPreferences, setUserPreferences] = useState({}) // Redux (cached from DB)
const [coreData, setCoreData] = useState([]) // Redux (cached from DB)
```

### 4. **State Normalization**
```typescript
// Good: Normalized state
{
  todos: {
    byId: { '1': todo1, '2': todo2 },
    allIds: ['1', '2']
  }
}

// Avoid: Nested arrays
{
  todos: [todo1, todo2] // Harder to update efficiently
}
```

## Common Anti-Patterns

### ❌ **Don't Store in Redux:**
- Large binary data (images, files)
- Data that never changes
- Data that's only used in one component
- Sensitive information (passwords, tokens)

### ❌ **Don't Store in Database:**
- Temporary UI state
- Computed/derived data
- Session-specific preferences
- Real-time data that changes frequently

## Migration Strategy

When refactoring existing code:

1. **Identify data types** - Is it UI state, business data, or derived data?
2. **Move UI state to Redux** - Loading, errors, form inputs
3. **Keep business data in database** - Users, todos, relationships
4. **Add derived state to Redux** - Computed values, filtered lists
5. **Implement proper caching** - Cache database data in Redux

## Summary

- **Redux**: UI state, temporary data, cached API responses, derived state
- **Database**: Business entities, user data, persistent preferences, analytics
- **Local State**: Component-specific temporary data (form inputs, UI toggles)

The key is understanding the lifecycle and purpose of each piece of data in your application. 