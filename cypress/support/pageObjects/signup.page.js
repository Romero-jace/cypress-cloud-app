export class SignupPage {
  visit() {
    return cy.visit("/signup");
  }

  emailField() {
    return cy.get("#email");
  }

  passwordField() {
    return cy.get("#password");
  }

  signupSubmitButton() {
    return cy.get('[data-testid="regular-signup-submit"]');
  }

  warningAlertMessage() {
    return cy.get(".alert-danger");
  }
}
