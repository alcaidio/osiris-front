describe('Sign in page', () => {
  describe('Sign in failure', () => {
    it('should stay in sign-in page and display an error message', () => {
      cy.visit('/sign-in')
      cy.get('input#email').type('inconnu@immergis.fr', { delay: 60 }).should('have.value', 'inconnu@immergis.fr')
      cy.get('input#password').type('inconnu', { delay: 60 }).should('have.value', 'inconnu')
      cy.wait(500)
      cy.get('button#submit').click()
      cy.wait(500)
      cy.url().should('include', '/sign-in')
      cy.get('#message').should('be.visible')
    })
  })

  describe('Sign in success', () => {
    it('should submit the form and redirect to map page', () => {
      cy.visit('/sign-in')
      cy.get('input#email').type('bob@immergis.fr', { delay: 60 }).should('have.value', 'bob@immergis.fr')
      cy.get('input#password').type('bobpass', { delay: 60 }).should('have.value', 'bobpass')
      cy.wait(300)
      cy.get('button#submit').click()
      cy.wait(300)
      cy.url().should('include', '/map')
    })
  })
})

describe('Map page', () => {
  it('should search a street and go on it', () => {
    cy.get('input').type('rue de la gare ', { delay: 100 })
    cy.wait(600)
    cy.get('input').type('{enter}').should('have.value', 'Rue De La Gare, 93120 La Courneuve, France')
  })
})
