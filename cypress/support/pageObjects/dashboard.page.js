export class DashboardPage {
  visit() {
    return cy.visit("/dashboard");
  }

  toastMessage() {
    return cy.get(".toast-body");
  }

  alertMessage() {
    return cy.get(".alert-message");
  }

  dropdownMenu() {
    return cy.get("#main-menu");
  }

  signoutLink() {
    return cy.get('[data-testid="dropdown-link-sign_out"]');
  }

  settingsLink() {
    return cy.get('[data-testid="dropdown-link-settings"]');
  }

  profileSettingsNavLink() {
    return cy.get('[data-testid="profile-settings"]');
  }

  avatarUpload() {
    //using .first because there were multiple input attributes on the page
    return cy.get("input[type=file]").first();
  }

  submitAboutYouButton() {
    return cy.get('[data-testid="onboarding-submit-about-you-form"]');
  }

  avatarImage() {
    return cy.get(".d-flex > #avatar");
  }

  warningAlertMessage() {
    return cy.get(".alert-danger");
  }
}
