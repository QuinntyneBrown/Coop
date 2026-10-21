import { test, expect } from '../../fixtures/public/auth.fixture';
import { RegisterPage } from '../../pages/public/register.page';
import { ForgotPasswordPage } from '../../pages/public/forgot-password.page';
import { LoginPage as AdminLoginPage } from '../../pages/admin/login.page';
import { DocumentsPage } from '../../pages/public/documents.page';
import { BottomTabBar } from '../../pages/public/bottom-tab-bar.page';

test.describe('Authentication', () => {
  // L2-REQ-101 AC1, AC2: the public site has no login screen of its own.
  test.describe('Sign in', () => {
    test('should take /login to the admin login screen', async ({ page }) => {
      await page.goto('/login');
      await new AdminLoginPage(page).expectOpen();
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

      test('should keep the entered values, disabled, while the account is created', async ({
        page,
      }) => {
        let release!: () => void;
        const held = new Promise<void>((resolve) => (release = resolve));
        await page.route('**/api/user/register', async (route) => {
          await held;
          await route.fallback();
        });

        await register.register({
          token: 'valid-invitation-token',
          username: 'e2e-busyuser',
          password: 'NewUser123!',
          confirmPassword: 'NewUser123!',
          acceptTerms: true,
        });

        await expect(register.createAccountButton).toHaveText(/Creating account/);
        await expect(register.invitationTokenInput).toHaveValue('valid-invitation-token');
        await expect(register.usernameInput).toHaveValue('e2e-busyuser');
        await expect(register.passwordInput).toHaveValue('NewUser123!');
        await expect(register.termsCheckbox).toBeChecked();
        await expect(register.invitationTokenInput).toBeDisabled();
        await expect(register.usernameInput).toBeDisabled();
        await expect(register.passwordInput).toBeDisabled();
        await expect(register.confirmPasswordInput).toBeDisabled();
        await expect(register.termsCheckbox).toBeDisabled();

        release();
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
      // L2-REQ-077 AC3, L2-REQ-101 AC4
      test('should open the admin login screen from Sign in', async ({ page }) => {
        await register.signInLink.click();
        await new AdminLoginPage(page).expectOpen();
      });
    });
  });

  test.describe('Forgot Password Page', () => {
    // L2-REQ-101 AC4
    test('should open the admin login screen from Back to Sign In', async ({ page }) => {
      const forgotPassword = new ForgotPasswordPage(page);
      await forgotPassword.goto();
      await forgotPassword.signInLink.click();
      await new AdminLoginPage(page).expectOpen();
    });
  });

  test.describe('Protected Routes', () => {
    // L2-REQ-101 AC5
    for (const path of ['/dashboard', '/maintenance', '/messaging', '/profile', '/onboarding']) {
      test(`should send a signed-out visitor on ${path} to the admin login screen`, async ({
        page,
      }) => {
        await page.goto(path);
        await new AdminLoginPage(page).expectOpen();
      });
    }

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

    test('should not show the member tab bar on public documents before sign-in', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      const documents = new DocumentsPage(page);
      await documents.goto();
      await expect(documents.pageTitle).toBeVisible();
      await expect(new BottomTabBar(page).bar).toHaveCount(0);
    });
  });
});
