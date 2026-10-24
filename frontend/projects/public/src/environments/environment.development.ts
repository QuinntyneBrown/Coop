import { Environment } from './environment-type';

/** Local development and the Playwright suite (see e2e/fixtures/mock-api). */
export const environment: Environment = {
  apiUrl: 'http://localhost:5000/api',
};
