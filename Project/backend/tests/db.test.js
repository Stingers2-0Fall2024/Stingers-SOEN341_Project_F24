const db = require('../config/db');

jest.mock('../config/db', () => ({
  getUser: jest.fn(),
  addUser: jest.fn(),
}));

test('getUser should return user data', async () => {
  db.getUser.mockResolvedValue({ id: 1, name: 'John Doe' });

  const user = await db.getUser(1);
  expect(user).toEqual({ id: 1, name: 'John Doe' });
});
