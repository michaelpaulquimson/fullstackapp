import request from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import userRoutes from '../routes/userRoutes';

jest.mock('../config/db', () => {
  const mPool = {
    query: jest.fn(),
    end: jest.fn(),
  };
  return mPool;
});
const pool = require('../config/db');

// Helper to cast pool.query to a jest mock
const mockQuery = pool.query as jest.Mock;

describe('POST /users', () => {
  const app = new Koa();
  app.use(bodyParser());
  app.use(userRoutes.routes());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    // No real DB, so just call end
    await pool.end();
  });

  it('should create a new user', async () => {
    mockQuery
      .mockResolvedValueOnce({ rowCount: 0 }) // No existing user
      .mockResolvedValueOnce({ rows: [{ id: 1, username: 'testuser', email: 'testuser@example.com', name: 'Test User', user_tags: '', role: 'user' }] });
    const res = await request(app.callback())
      .post('/users')
      .send({ username: 'testuser', email: 'testuser@example.com', password: 'testpass', name: 'Test User' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toBe('testuser');
    expect(res.body.email).toBe('testuser@example.com');
  });

  it('should not allow duplicate usernames or emails', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 }); // User exists
    const res = await request(app.callback())
      .post('/users')
      .send({ username: 'testuser', email: 'testuser@example.com', password: 'testpass', name: 'Test User' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app.callback())
      .post('/users')
      .send({ username: '', email: '', password: '' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
