const { validateToken } = require('../middlewares/authMiddleware');
const { authMiddleware } = require('../middlewares/authMiddleware');

test('should call next() if token is valid', () => {
  const token = jwt.sign({ username: 'test' }, 'your_secret_key'); // Use your test key here
  const req = { headers: { authorization: token } };
  const res = {};
  const next = jest.fn();

  authMiddleware(req, res, next);

  expect(next).toHaveBeenCalled();
  expect(req.user).toBeDefined();
  expect(req.user.username).toBe('test');
});

test('should respond with 401 if token is missing', () => {
  const req = { headers: {} };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();

  authMiddleware(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ message: 'Token missing' });
  expect(next).not.toHaveBeenCalled();
});
