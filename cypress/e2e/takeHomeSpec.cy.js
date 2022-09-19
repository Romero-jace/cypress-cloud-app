/// <reference types= "cypress" />
import { faker } from "@faker-js/faker";
import { DashboardPage } from "../support/pageObjects/dashboard.page";
import { LoginPage } from "../support/pageObjects/login.page";
import { SignupPage } from "../support/pageObjects/signup.page";

/*
With more context I would probably split out login/signup/account info update into their own spec files.
More for organization purposes along with Parallel runs in CI being quicker.
*/

const login = new LoginPage();
const signup = new SignupPage();
const dashboard = new DashboardPage();
describe("Account Test", () => {
  let randomNumbers;
  let userEmail;
  beforeEach(() => {
    randomNumbers = faker.random.alphaNumeric(5);
    userEmail = `jace+automation${randomNumbers}@testEmail.com`;
  });
  it("Creates an account through Sign up", () => {
    signup.visit();
    signup.emailField().type(userEmail);
    signup.passwordField().type("Password123$"); //just for simplicity/testing purposes, if need be would make sure this is more secure
    signup.signupSubmitButton().click();
    dashboard.toastMessage().should("contain", "Account created successfully");
    cy.url().should("include", "/onboarding/");
  });

  it("Logs in with previously created account", () => {
    cy.createAccountAPI(userEmail);
    cy.request("/logout");
    cy.visit("/login");
    login.emailField().type(userEmail);
    login.passwordField().type("Password123$");
    login.submitButton().click();
    cy.url().should("include", "/dashboard");
    dashboard.alertMessage().should("contain", "Welcome back!");
  });

  it("Signs out of an account", () => {
    cy.createAccountAPI(userEmail);
    cy.visit("/");
    dashboard.dropdownMenu().click();
    dashboard.signoutLink().should("contain", "Sign out").click();
    login.alertMessage().should("contain", "Successfully Logged Out");
    cy.url().should("include", "/login"); // Asserting proper behavior with redirection back to login page
  });

  it("Update avatar image from Profile > Settings", () => {
    cy.createAccountAPI(userEmail);
    cy.visit("/");
    dashboard.dropdownMenu().click();
    dashboard.settingsLink().should("contain", "Settings").click();
    dashboard.profileSettingsNavLink().should("contain", "Profile").click();
    dashboard
      .avatarUpload()
      .selectFile("./cypress/support/uploadFiles/avatar.jpg");
    dashboard.submitAboutYouButton().click();
    dashboard.toastMessage().should("contain", "Account updated successfully");
    dashboard
      .avatarImage()
      .invoke("attr", "style")
      .should("include", "/avatar.jpg"); // Probably too simple, would either want to do screenshot comparison to make sure the image actually appears properly or use 3rd party tool
  });

  it("Verifies proper error messaging on signup form", () => {
    //If there was going to be more negative testing then I would suggest maybe splitting this out further, but since it's just two quick checks I'll stick with this.
    signup.visit();
    signup.emailField().type("missingFullDomain@blah");
    signup.passwordField().type("Password123$");
    signup.signupSubmitButton().click();
    signup
      .warningAlertMessage()
      .should("contain", "Validation failed: Email is invalid");

    signup.emailField().clear().type("missingFullDomain@blah.com");
    signup.passwordField().type("Password");
    signup.signupSubmitButton().click();
    signup
      .warningAlertMessage()
      .should(
        "contain",
        "Validation failed: Password must be at least 8 characters long, contain uppercase and lowercase letters and a number."
      );
  });

  it("Verifies proper error messaging on login form for incorrect email/password combination", () => {
    // really simple since I assume this is about the only error messaging provided for security purposes
    login.visit();
    login.emailField().type("thisDoesNotExist@nope.co");
    login.passwordField().type("Password");
    login.submitButton().click();
    login
      .warningAlertMessage()
      .should("contain", "Invalid email / password combination");
  });

  it("Verifies a logged out user cannot visit the dashboard (nothing remains)", () => {
    cy.createAccountAPI(userEmail);
    cy.request("/logout");
    dashboard.visit();
    cy.url().should("include", "/login"); // Asserting proper behavior with redirection back to login page
  });

  it("Verifies unable to upload non-image file type", () => {
    cy.createAccountAPI(userEmail);
    cy.visit("/");
    dashboard.dropdownMenu().click();
    dashboard.settingsLink().should("contain", "Settings").click();
    dashboard.profileSettingsNavLink().should("contain", "Profile").click();
    dashboard
      .avatarUpload()
      .selectFile("./cypress/support/uploadFiles/blank.pdf");
    dashboard.submitAboutYouButton().click();
    dashboard.warningAlertMessage().contains("Avatar must be an image");
  });
});
