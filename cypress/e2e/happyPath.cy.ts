describe('Happy Path', () => {
  it('should be see the login button', () => {
    cy.visit('/')
    cy.get('[data-testid="login-button"]')
      .should('be.visible')
      .click()
    cy.get('[data-testid="google-signin-button"]')
      .should('be.visible')
  })


  it('should be able to create a program when logged in', () => {
    cy.login()
    cy.visit('/')
    cy.get('[data-testid="create-program-card"]')
      .should('be.visible').click()
  })

})
