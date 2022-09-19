export class LoginPage {
  visit() {
    return cy.visit("/login");
  }

  emailField() {
    return cy.get('[data-testid="regular-login-email"]');
  }

  passwordField() {
    return cy.get('[data-testid="regular-login-password"]');
  }

  submitButton() {
    return cy.get('[data-testid="regular-login-submit"]');
  }

  alertMessage() {
    return cy.get(".alert");
  }

  warningAlertMessage() {
    return cy.get(".alert-danger");
  }
}
