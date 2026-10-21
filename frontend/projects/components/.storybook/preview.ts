import type { Preview } from '@storybook/angular';

const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
      },
    },
    options: {
      storySort: {
        // The groups of the design system's index, docs/design-system/index.html.
        order: [
          'Foundations',
          'Actions',
          'Inputs',
          'Navigation',
          'Containers and overlays',
          'Data display',
          'Feedback',
        ],
      },
    },
  },
};

export default preview;
