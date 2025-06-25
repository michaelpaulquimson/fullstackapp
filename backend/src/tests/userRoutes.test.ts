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
const mockQuery = pool.query as jest.Mock;

describe('GET /users', () => {
  const app = new Koa();
  app.use(bodyParser());
  app.use(userRoutes.routes());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an array of users', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, username: 'user1', email: 'user1@example.com', name: 'User One', user_tags: '', role: 'user' }] });
    const res = await request(app.callback())
      .get('/users')
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('PATCH /users/:id/role', () => {
  const app = new Koa();
  app.use(bodyParser());
  app.use(userRoutes.routes());
  let userId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update the user role', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: userId, username: 'patchuser', email: 'patchuser@example.com', name: 'Patch User', user_tags: '', role: 'admin' }], rowCount: 1 });
    const res = await request(app.callback())
      .patch(`/users/${userId}/role`)
      .send({ role: 'admin' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body.role).toBe('admin');
  });

  it('should return 404 for non-existent user', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 0 });
    const res = await request(app.callback())
      .patch('/users/999999/role')
      .send({ role: 'admin' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 for missing role', async () => {
    const res = await request(app.callback())
      .patch(`/users/${userId}/role`)
      .send({})
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
