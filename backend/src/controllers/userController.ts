import { Context } from 'koa';
import pool from '../config/db';

// POST /users
export async function createUser(ctx: Context) {
  const { username, email, password, name, userTags } = ctx.request.body as { username: string; email: string; password: string; name: string; userTags?: string };
  console.log('Creating user:', { username, email, password, name, userTags });
  if (!username || !email || !password || !name) {
    ctx.status = 400;
    ctx.body = { error: 'username, email, password, and name are required' };
    return;
  }
  try {
    // Check for unique username and email
    const existing = await pool.query('SELECT 1 FROM users WHERE username = $1 OR email = $2', [username, email]);
    if ((existing?.rowCount ?? 0) > 0) {
      ctx.status = 409;
      ctx.body = { error: 'Username or email already exists' };
      return;
    }
    const result = await pool.query(
      'INSERT INTO users (username, email, password, name, userTags) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, email, password, name, userTags || null]
    );
    console.log('User created:', result);
    ctx.status = 201;
    ctx.body = result.rows[0];
  } catch (err: any) {
    console.error('Error creating user:', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
}

// GET /users
export async function getAllUsers(ctx: Context) {
  try {
    const result = await pool.query('SELECT id, username, email, name, userTags FROM users ORDER BY id');
    ctx.status = 200;
    ctx.body = result.rows;
  } catch (err: any) {
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
}
