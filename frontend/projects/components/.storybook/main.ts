import type { StorybookConfig } from '@storybook/angular';

// Storybook for the components library (ADR 0012). The angular.json `storybook` and
// `build-storybook` targets load the same global styles as the admin app.
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.ts'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: '@storybook/angular',
};

export default config;
