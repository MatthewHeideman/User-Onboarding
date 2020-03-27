describe("Testing our volunteer form", function() {
    beforeEach(function() {
      cy.visit("http://localhost:3000/");
    });
    it("Add test to inputs and submit form", function() {
      cy.get('input[name="name"]')
      .type("Dawson")
      .should("have.value", "Matthew")
      cy.get('input[name="email"]')
      .type("email@email.com")
      .should("have.value", "email@email.com")
      cy.get('textarea')
      .type('I want to help people')
      .should("have.value", "I want to help people")
      cy.get('#positions')
      .select('Yard Work')
      .should("have.value", "Yard Work")
      cy.get('[type="checkbox"]')
      .check()
      .should("be.checked")
      cy.get('button').click()
    });
  });