describe('Blog ', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Markus Himanen',
      username: 'Markus',
      password: 'fullstack'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.visit('http://localhost:3000')
  })
  it('Login form is shown', function() {
    cy.contains('log in')
  })
  describe('login', function() {
    it('succeeds with correct credentials', function() {
      cy.contains('log in').click()
      cy.get('#username').type('Markus')
      cy.get('#password').type('fullstack')
      cy.get('#login-button').click()
      cy.contains('Markus Himanen logged in')
    })
    it('fails with wrong password', function() {
      cy.contains('log in').click()
      cy.get('#username').type('Markus')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
  
      cy.get('.errorRed')
        .should('contain', 'wrong credentials')
      cy.get('html').should('not.contain', 'Markus Himanen logged in')
    })
  })
  
  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('log in').click()
      cy.get('#username').type('Markus')
      cy.get('#password').type('fullstack')
      cy.get('#login-button').click()
    })

    it('a new blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('cypresstitle')
      cy.get('#author').type('cypressauthor')
      cy.get('#url').type('www.cypress.com')
      cy.contains('save').click()
      cy.contains('new blog added: cypresstitle by cypressauthor')
      cy.contains('cypresstitle by cypressauthor')
    })
  })

  describe('blog has been created', function() {
    beforeEach(function() {
      cy.contains('log in').click()
      cy.get('#username').type('Markus')
      cy.get('#password').type('fullstack')
      cy.get('#login-button').click()

      cy.contains('new blog').click()
      cy.get('#title').type('cypresstitle')
      cy.get('#author').type('cypressauthor')
      cy.get('#url').type('www.cypress.com')
      cy.contains('save').click()
      cy.contains('new blog added: cypresstitle by cypressauthor')
      cy.contains('cypresstitle by cypressauthor')
    })
    it('blog can be liked', function() {
      cy.contains('view more info').click()
      cy.contains('likes: 0')
      cy.contains('Like').click()
      cy.contains('likes: 1')
    })
  })
})