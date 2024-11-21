const { validateToken } = require('../middlewares/authMiddleware');

test('should call next() if token is valid', () => {
  const req = { headers: { authorization: 'Bearer valid-token' } };
  const res = {};
  const next = jest.fn();

  validateToken(req, res, next);

  expect(next).toHaveBeenCalled();
});

test('should respond with 401 if token is missing', () => {
  const req = { headers: {} };
  const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
  const next = jest.fn();

  validateToken(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.send).toHaveBeenCalledWith('Unauthorized');
});
