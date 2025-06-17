import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'

// Mock the root element
const mockRoot = document.createElement('div')
mockRoot.id = 'root'
document.body.appendChild(mockRoot)

// Mock ReactDOM.createRoot
vi.mock('react-dom/client', () => ({
  createRoot: () => ({
    render: vi.fn(),
  }),
}))

describe('Main App Initialization', () => {
  it('renders the app without crashing', () => {
    const { container } = render(
      <Provider store={store}>
        <App />
      </Provider>
    )
    expect(container).toBeTruthy()
  })
}) 