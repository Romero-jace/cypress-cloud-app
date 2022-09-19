// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("retrieveCSRFToken", (pageURL) => {
  // Tried to make this a bit more module friendly incase you wanted to do login via API. Just trying to be clean
  cy.request({ url: `${pageURL}` })
    .its("body")
    .then((body) => {
      const $html = Cypress.$(body);
      const token = $html.filter('meta[name="csrf-token"]').attr("content");
      cy.wrap(token).as("CSRFToken");
    });
});

Cypress.Commands.add("createAccountAPI", (userEmail) => {
  cy.retrieveCSRFToken("/signup");
  cy.get("@CSRFToken").then((token) => {
    cy.request({
      url: "api/v4/account",
      method: "POST",
      body: {
        authenticity_token: token,
        email: userEmail,
        password: "Password123$",
        commit: "Sign up",
      },
    });
  });
});
