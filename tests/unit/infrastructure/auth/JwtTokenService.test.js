process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'unit_test_secret_please_do_not_reuse_xxxxxxxxxxxxxxxxxx';
process.env.PGHOST = 'localhost';
process.env.PGPORT = '5432';
process.env.PGDATABASE = 'taskapi';
process.env.PGUSER = 'taskapi_app';
process.env.PGPASSWORD = 'unit_test_only_password';

const jwt = require('jsonwebtoken');
const { JwtTokenService } = require('../../../../src/infrastructure/auth/JwtTokenService');
const { AuthenticationError } = require('../../../../src/domain/errors/AppError');

describe('JwtTokenService', () => {
  const service = new JwtTokenService();

  test('rejects expired tokens with a generic authentication error', () => {
    const token = jwt.sign({ sub: 'user-1' }, process.env.JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: -1,
    });

    expect(() => service.verify(token)).toThrow(AuthenticationError);
    expect(() => service.verify(token)).toThrow('Invalid or expired token');
  });

  test('rejects tokens signed with a different secret', () => {
    const token = jwt.sign({ sub: 'user-1' }, 'different_secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', {
      algorithm: 'HS256',
      expiresIn: '5m',
    });

    expect(() => service.verify(token)).toThrow(AuthenticationError);
  });

  test('rejects malformed tokens', () => {
    expect(() => service.verify('not-a-jwt')).toThrow(AuthenticationError);
  });
});
