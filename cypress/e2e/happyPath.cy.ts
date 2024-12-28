describe('Happy Path', () => {
  it('should be able to login', () => {
    cy.visit('https://neo-republic-sandbox--neo-republic-sandbox.europe-west4.hosted.app/')
    cy.get('[data-testid="login-button"]')
      .should('be.visible')
      .click()
    cy.get('[data-testid="google-signin-button"]')
      .should('be.visible')
  })
  
})
