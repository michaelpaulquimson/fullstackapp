import request from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import userRoutes from '../routes/userRoutes';
import pool from '../config/db';

describe('POST /users', () => {
  const app = new Koa();
  app.use(bodyParser());
  app.use(userRoutes.routes());

  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE username = $1', ['testuser']);
    await pool.end();
  });

  it('should create a new user', async () => {
    const res = await request(app.callback())
      .post('/users')
      .send({ username: 'testuser', email: 'testuser@example.com', password: 'testpass' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.username).toBe('testuser');
    expect(res.body.email).toBe('testuser@example.com');
  });

  it('should not allow duplicate usernames or emails', async () => {
    await request(app.callback())
      .post('/users')
      .send({ username: 'testuser', email: 'testuser@example.com', password: 'testpass' })
      .set('Content-Type', 'application/json');
    const res = await request(app.callback())
      .post('/users')
      .send({ username: 'testuser', email: 'testuser@example.com', password: 'testpass' })
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
