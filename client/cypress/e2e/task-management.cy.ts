/// <reference types="cypress" />

describe('Task Management', () => {
  beforeEach(() => {
    // Visit the app before each test
    cy.visit('http://localhost:5173')
  })

  it('should create and delete a task', () => {
    const taskText = 'Test task ' + Date.now() // Unique task text

    // Create a new task
    cy.get('input[placeholder="Add a task..."]').type(taskText)
    cy.get('button').contains('Add').click()

    // Verify the task was created
    cy.contains(taskText).should('be.visible')

    // Delete the task
    cy.contains(taskText)
      .parent()
      .find('button')
      .click()

    // Verify the task was deleted
    cy.contains(taskText).should('not.exist')
  })
}) 