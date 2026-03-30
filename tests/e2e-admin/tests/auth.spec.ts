import { test, expect } from '../fixtures/api.fixture';
import { LoginPage } from '../pages/login.page';
import { RegisterPage } from '../pages/register.page';
import { ChangePasswordPage } from '../pages/change-password.page';

test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.describe('Layout and Elements', () => {
    test('should display the hero panel with branding', async () => {
      await loginPage.expectHeroPanelVisible();
    });

    test('should display the login form with all fields', async () => {
      await loginPage.expectFormVisible();
    });

    test('should show "Welcome back" heading and subtitle', async () => {
      await expect(loginPage.heading).toHaveText('Welcome back');
      await expect(loginPage.subtitle).toContainText('Sign in to your account to continue');
    });

    test('should display remember me checkbox', async () => {
      await expect(loginPage.rememberMeCheckbox).toBeVisible();
    });

    test('should display forgot password link', async () => {
      await expect(loginPage.forgotPasswordLink).toBeVisible();
    });

    test('should display sign up link', async () => {
      await expect(loginPage.signUpLink).toBeVisible();
      await expect(loginPage.signUpLink).toContainText('Sign up');
    });

    test('should have green sign in button full width', async ({ page }) => {
      await expect(loginPage.signInButton).toHaveText('Sign In');
      const box = await loginPage.signInButton.boundingBox();
      const parentBox = await loginPage.formPanel.boundingBox();
      expect(box).toBeTruthy();
      expect(parentBox).toBeTruthy();
      // Button should take most of the form panel width
      if (box && parentBox) {
        expect(box.width).toBeGreaterThan(parentBox.width * 0.8);
      }
    });
  });

  test.describe('Form Validation', () => {
    test('should show validation errors when submitting empty form', async () => {
      await loginPage.signInButton.click();
      await loginPage.expectValidationErrors();
    });

    test('should show error when username is empty', async () => {
      await loginPage.passwordInput.fill('somepassword');
      await loginPage.signInButton.click();
      await expect(loginPage.usernameError).toBeVisible();
    });

    test('should show error when password is empty', async () => {
      await loginPage.usernameInput.fill('someuser');
      await loginPage.signInButton.click();
      await expect(loginPage.passwordError).toBeVisible();
    });
  });

  test.describe('Authentication', () => {
    test('should successfully login with valid credentials', async ({ page }) => {
      await loginPage.loginAndWaitForDashboard('admin', 'Admin123!');
      await expect(page).toHaveURL(/dashboard/);
    });

    test('should show error with invalid credentials', async () => {
      await loginPage.login('admin', 'WrongPassword!');
      await loginPage.expectLoginError();
    });

    test('should show error with non-existent user', async () => {
      await loginPage.login('nonexistentuser', 'SomePassword1!');
      await loginPage.expectLoginError();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to register page via sign up link', async ({ page }) => {
      await loginPage.signUpLink.click();
      await expect(page).toHaveURL(/register/);
    });

    test('should navigate to forgot password page', async ({ page }) => {
      await loginPage.forgotPasswordLink.click();
      await expect(page).toHaveURL(/forgot-password/);
    });
  });

  test.describe('Responsive Layout', () => {
    test('should show both panels on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await expect(loginPage.heroPanel).toBeVisible();
      await expect(loginPage.formPanel).toBeVisible();
    });

    test('should hide hero panel on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await expect(loginPage.heroPanel).toBeHidden();
      await expect(loginPage.formPanel).toBeVisible();
    });

    test('should be usable at tablet size', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(loginPage.formPanel).toBeVisible();
      await expect(loginPage.usernameInput).toBeVisible();
      await expect(loginPage.signInButton).toBeVisible();
    });
  });
});

test.describe('Register Page', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test.describe('Layout and Elements', () => {
    test('should display the hero panel with cooperative branding', async () => {
      await registerPage.expectHeroPanelVisible();
    });

    test('should display the registration form with all fields', async () => {
      await registerPage.expectFormVisible();
    });

    test('should show create account heading and subtitle', async () => {
      await expect(registerPage.heading).toHaveText('Create account');
      await expect(registerPage.subtitle).toContainText('invitation token');
    });

    test('should display sign in link', async () => {
      await expect(registerPage.signInLink).toBeVisible();
      await expect(registerPage.signInLink).toContainText('Sign in');
    });
  });

  test.describe('Form Validation', () => {
    test('should show validation errors when submitting empty form', async () => {
      await registerPage.createAccountButton.click();
      await expect(registerPage.tokenError).toBeVisible();
      await expect(registerPage.usernameError).toBeVisible();
      await expect(registerPage.passwordError).toBeVisible();
    });

    test('should show error when passwords do not match', async () => {
      await registerPage.invitationTokenInput.fill('some-token');
      await registerPage.usernameInput.fill('newuser');
      await registerPage.passwordInput.fill('Password123!');
      await registerPage.confirmPasswordInput.fill('DifferentPassword!');
      await registerPage.createAccountButton.click();
      await registerPage.expectPasswordMismatchError();
    });

    test('should show error when terms are not accepted', async () => {
      await registerPage.invitationTokenInput.fill('some-token');
      await registerPage.usernameInput.fill('newuser');
      await registerPage.passwordInput.fill('Password123!');
      await registerPage.confirmPasswordInput.fill('Password123!');
      await registerPage.createAccountButton.click();
      await expect(registerPage.termsError).toBeVisible();
    });
  });

  test.describe('Registration Flow', () => {
    test('should successfully register with valid invitation token', async ({ page, api }) => {
      const invitation = await api.createInvitation('Member');
      await registerPage.register(invitation.token, 'testuser_e2e', 'TestPassword123!');
      await expect(page).toHaveURL(/login|dashboard/);
    });

    test('should show error with invalid invitation token', async () => {
      await registerPage.register('invalid-token-12345', 'testuser2', 'Password123!');
      await expect(registerPage.formError).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to login page via sign in link', async ({ page }) => {
      await registerPage.signInLink.click();
      await expect(page).toHaveURL(/login/);
    });
  });
});

test.describe('Change Password Page', () => {
  let changePasswordPage: ChangePasswordPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    changePasswordPage = new ChangePasswordPage(authenticatedPage);
    await changePasswordPage.goto();
  });

  test.describe('Layout and Elements', () => {
    test('should display the change password card', async () => {
      await changePasswordPage.expectPageVisible();
    });

    test('should display the form with all fields', async () => {
      await changePasswordPage.expectFormVisible();
    });

    test('should display password requirements hint', async () => {
      await expect(changePasswordPage.passwordHint).toContainText('8 characters');
    });

    test('should show lock icon', async () => {
      await expect(changePasswordPage.lockIcon).toBeVisible();
    });
  });

  test.describe('Form Validation', () => {
    test('should show errors when submitting empty form', async () => {
      await changePasswordPage.updatePasswordButton.click();
      await expect(changePasswordPage.currentPasswordError).toBeVisible();
      await expect(changePasswordPage.newPasswordError).toBeVisible();
    });

    test('should show error when new passwords do not match', async () => {
      await changePasswordPage.changePassword('Admin123!', 'NewPass123!', 'DifferentPass!');
      await expect(changePasswordPage.confirmPasswordError).toBeVisible();
    });

    test('should show error when new password is too short', async () => {
      await changePasswordPage.changePassword('Admin123!', 'Short1!', 'Short1!');
      await expect(changePasswordPage.newPasswordError).toBeVisible();
    });
  });

  test.describe('Password Change Flow', () => {
    test('should show error with wrong current password', async () => {
      await changePasswordPage.changePassword('WrongPassword!', 'NewPassword123!');
      await expect(changePasswordPage.formError).toBeVisible();
    });

    test('should navigate back when cancel is clicked', async ({ authenticatedPage }) => {
      await changePasswordPage.cancelButton.click();
      await expect(authenticatedPage).not.toHaveURL(/change-password/);
    });
  });
});
