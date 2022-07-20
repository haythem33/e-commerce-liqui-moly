import { AuthValidationMiddleware } from './auth-validation.middleware';

describe('AuthValidationMiddleware', () => {
  it('should be defined', () => {
    expect(new AuthValidationMiddleware()).toBeDefined();
  });
});
