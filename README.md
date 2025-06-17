# Todo App with Testing

A full-stack Todo application built with React, Redux, and Node.js, featuring comprehensive testing with Vitest and Cypress.

## Features

- Create, read, update, and delete todos
- Toggle todo completion status
- Persistent storage with backend API
- Full test coverage with unit and E2E tests

## Tech Stack

### Frontend
- React
- Redux Toolkit
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express
- SQLite

### Testing
- Vitest (Unit Testing)
- React Testing Library
- Cypress (E2E Testing)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd [your-repo-name]
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Start the development servers:
```bash
# Start the backend server (from server directory)
npm start

# Start the frontend development server (from client directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

## Testing

### Unit Tests
```bash
cd client
npm test
```

### E2E Tests
```bash
cd client
npx cypress open
```

### Coverage Report
```bash
cd client
npm run test:coverage
```

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/               # Source files
│   ├── cypress/           # E2E tests
│   └── ...
├── server/                # Backend Node.js application
│   ├── server.js         # Main server file
│   └── ...
└── ...
```

## License

MIT 