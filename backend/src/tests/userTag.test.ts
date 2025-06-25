import request from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import userTagRoutes from '../routes/userTagRoutes';

jest.mock('../config/db', () => {
  const mPool = {
    query: jest.fn(),
    end: jest.fn(),
  };
  return mPool;
});
const pool = require('../config/db');
const mockQuery = pool.query as jest.Mock;

describe('User Tag Routes', () => {
  const app = new Koa();
  app.use(bodyParser());
  app.use(userTagRoutes.routes());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new user tag', async () => {
    mockQuery
      .mockResolvedValueOnce({ rowCount: 0 }) // No existing tag
      .mockResolvedValueOnce({ rows: [{ id: 1, tag: 'testtag' }] });
    const res = await request(app.callback())
      .post('/user-tags')
      .send({ tag: 'testtag' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.tag).toBe('testtag');
  });

  it('should not allow duplicate tags', async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 }); // Tag exists
    const res = await request(app.callback())
      .post('/user-tags')
      .send({ tag: 'testtag' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty('error');
  });

  it('should get all user tags', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 1, tag: 'testtag' }] });
    const res = await request(app.callback())
      .get('/user-tags')
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
