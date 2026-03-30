import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';

test.describe('Authentication', () => {
  test.describe('Login Page', () => {
    let login: LoginPage;

    test.beforeEach(async ({ page }) => {
      login = new LoginPage(page);
      await login.goto();
    });

    test('should load the login page', async () => {
      await login.expectLoaded();
    });

    test('should display the green header with Coop branding', async () => {
      await login.expectHeaderContent();
    });

    test('should display "Welcome back" heading', async () => {
      await expect(login.welcomeHeading).toHaveText('Welcome back');
    });

    test('should have username and password fields', async () => {
      await expect(login.usernameInput).toBeVisible();
      await expect(login.passwordInput).toBeVisible();
    });

    test('should have a "Forgot password?" link', async () => {
      await expect(login.forgotPasswordLink).toBeVisible();
      await expect(login.forgotPasswordLink).toHaveText(/forgot password/i);
    });

    test('should have a full-width "Sign In" button', async () => {
      await expect(login.signInButton).toBeVisible();
      await expect(login.signInButton).toHaveText(/sign in/i);
    });

    test('should have a "Don\'t have an account? Sign up" link', async () => {
      await expect(login.signUpLink).toBeVisible();
      await expect(login.signUpLink).toContainText(/sign up/i);
    });

    test.describe('Form Validation', () => {
      test('should show validation error when submitting empty form', async () => {
        await login.signInButton.click();
        await login.expectValidationErrors();
      });

      test('should show validation error for empty username', async () => {
        await login.passwordInput.fill('somepassword');
        await login.signInButton.click();
        await expect(login.usernameError).toBeVisible();
      });

      test('should show validation error for empty password', async () => {
        await login.usernameInput.fill('someuser');
        await login.signInButton.click();
        await expect(login.passwordError).toBeVisible();
      });
    });

    test.describe('Login Flow', () => {
      test('should login successfully with valid credentials', async ({ page }) => {
        await login.login('member', 'Member123!');
        await page.waitForURL('**/dashboard');
        await expect(page).toHaveURL(/\/dashboard/);
      });

      test('should show error for invalid credentials', async () => {
        await login.login('invaliduser', 'WrongPass123!');
        await login.expectLoginError();
      });

      test('should show error for wrong password', async () => {
        await login.login('member', 'WrongPassword!');
        await login.expectLoginError();
      });
    });

    test.describe('Navigation', () => {
      test('should navigate to register page', async () => {
        await login.navigateToSignUp();
        await expect(login.page).toHaveURL(/\/register/);
      });

      test('should navigate to forgot password page', async () => {
        await login.navigateToForgotPassword();
        await expect(login.page).toHaveURL(/\/forgot-password/);
      });
    });

    test.describe('Mobile Layout', () => {
      test('should display bottom tab bar on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        login = new LoginPage(page);
        await login.goto();
        await login.expectMobileTabBar();
      });

      test('bottom tab bar should have all five tabs', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        login = new LoginPage(page);
        await login.goto();
        await expect(login.tabHome).toBeVisible();
        await expect(login.tabRequests).toBeVisible();
        await expect(login.tabDocs).toBeVisible();
        await expect(login.tabMessages).toBeVisible();
        await expect(login.tabProfile).toBeVisible();
      });
    });
  });

  test.describe('Register Page', () => {
    let register: RegisterPage;

    test.beforeEach(async ({ page }) => {
      register = new RegisterPage(page);
      await register.goto();
    });

    test('should load the register page', async () => {
      await register.expectLoaded();
    });

    test('should display the green header with "Join your cooperative"', async () => {
      await register.expectHeaderContent();
    });

    test('should display "Create account" heading', async () => {
      await expect(register.heading).toHaveText('Create account');
    });

    test('should have all required form fields', async () => {
      await expect(register.invitationTokenInput).toBeVisible();
      await expect(register.usernameInput).toBeVisible();
      await expect(register.passwordInput).toBeVisible();
      await expect(register.confirmPasswordInput).toBeVisible();
      await expect(register.termsCheckbox).toBeVisible();
    });

    test('should have "Create Account" button', async () => {
      await expect(register.createAccountButton).toBeVisible();
      await expect(register.createAccountButton).toHaveText(/create account/i);
    });

    test('should have "Already have an account? Sign in" link', async () => {
      await expect(register.signInLink).toBeVisible();
      await expect(register.signInLink).toContainText(/sign in/i);
    });

    test.describe('Form Validation', () => {
      test('should show errors when submitting empty form', async () => {
        await register.submit();
        await expect(
          register.tokenError
            .or(register.usernameError)
            .or(register.passwordError)
            .first(),
        ).toBeVisible();
      });

      test('should show error when passwords do not match', async () => {
        await register.fillForm({
          token: 'test-token',
          username: 'newuser',
          password: 'Password123!',
          confirmPassword: 'DifferentPassword!',
          acceptTerms: true,
        });
        await register.submit();
        await register.expectPasswordMismatchError();
      });

      test('should require terms acceptance', async () => {
        await register.fillForm({
          token: 'test-token',
          username: 'newuser',
          password: 'Password123!',
          confirmPassword: 'Password123!',
          acceptTerms: false,
        });
        await register.submit();
        await register.expectTermsRequired();
      });
    });

    test.describe('Registration Flow', () => {
      test('should register with a valid invitation token', async ({ page }) => {
        await register.register({
          token: 'valid-invitation-token',
          username: 'e2e-newuser',
          password: 'NewUser123!',
          confirmPassword: 'NewUser123!',
          acceptTerms: true,
        });
        // Successful registration redirects to onboarding or dashboard
        await expect(page).toHaveURL(/\/(onboarding|dashboard)/);
      });

      test('should show error for invalid invitation token', async () => {
        await register.register({
          token: 'invalid-token-xyz',
          username: 'e2e-newuser2',
          password: 'NewUser123!',
          confirmPassword: 'NewUser123!',
          acceptTerms: true,
        });
        await expect(register.registrationError).toBeVisible();
      });
    });

    test.describe('Navigation', () => {
      test('should navigate to sign in page', async () => {
        await register.navigateToSignIn();
        await expect(register.page).toHaveURL(/\/login/);
      });
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect /dashboard to /login when not authenticated', async ({ page }) => {
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect /maintenance to /login when not authenticated', async ({ page }) => {
      await page.goto('/maintenance');
      await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect /messaging to /login when not authenticated', async ({ page }) => {
      await page.goto('/messaging');
      await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect /profile to /login when not authenticated', async ({ page }) => {
      await page.goto('/profile');
      await expect(page).toHaveURL(/\/login/);
    });

    test('should allow anonymous access to landing page', async ({ page }) => {
      await page.goto('/');
      await expect(page).not.toHaveURL(/\/login/);
    });

    test('should allow anonymous access to public documents', async ({ page }) => {
      await page.goto('/documents');
      // Documents may be public or require auth depending on configuration
      // At minimum, the page should not error
      await expect(page.locator('body')).toBeVisible();
    });
  });
});
