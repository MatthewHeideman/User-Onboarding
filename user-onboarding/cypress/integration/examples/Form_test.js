describe("Testing our volunteer form", function() {
    beforeEach(function() {
      cy.visit("http://localhost:3000/");
    });
    it("Add test to inputs and submit form", function() {
      cy.get('input[name="name"]')
      .type("Matthew")
      .should("have.value", "Matthew")
      cy.get('input[name="email"]')
      .type("email@email.com")
      .should("have.value", "email@email.com")
      cy.get('input[name="password"]')
      .type('thisisapassword')
      .should("have.value", "thisisapassword")
      cy.get('[type="checkbox"]')
      .check()
      .should("be.checked")
      cy.get('button').click()
    });
    it("Testing for validations", function() {
        cy.get('input[name="name"]')
        .type('Matthew').clear()
        cy.get('[data-cy = "nameError"]')
        cy.get('input[name="email"]')
        .type('email@email.com').clear()
        cy.get('[data-cy = "emailError"]')
    })
  });