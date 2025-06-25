import { Context } from 'koa';
import pool from '../config/db';
import { sendError } from '../helpers/utils';
import bcrypt from 'bcrypt';

// POST /users
export async function createUser(ctx: Context): Promise<void> {
  const { username, email, password, name, userTags = '' } = ctx.request.body as {
    username: string;
    email: string;
    password: string;
    name: string;
    userTags?: string;
  };

  if (!username || !email || !password || !name) {
    return sendError(ctx, 400, 'username, email, password, and name are required');
  }

  try {
    const existing = await pool.query(
      'SELECT 1 FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );
    if ((existing.rowCount ?? 0) > 0) {
      return sendError(ctx, 409, 'Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (username, email, password, name, user_tags) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, name, user_tags, role',
      [username, email, hashedPassword, name, userTags]
    );
    ctx.status = 201;
    ctx.body = result.rows[0];
  } catch (err) {
    sendError(ctx, 500, 'Internal server error', err);
  }
}

// GET /users
export async function getAllUsers(ctx: Context): Promise<void> {
  try {
    const result = await pool.query(
      'SELECT id, username, email, name, user_tags, role FROM users ORDER BY id'
    );
    ctx.status = 200;
    ctx.body = result.rows;
  } catch (err) {
    sendError(ctx, 500, 'Internal server error', err);
  }
}

// PATCH /users/:id/role
export async function updateUserRole(ctx: Context): Promise<void> {
  const { id: userId } = ctx.params;
  const { role } = ctx.request.body as { role: string };

  if (!role || typeof role !== 'string' || role.trim() === '') {
    return sendError(ctx, 400, 'role (string) is required');
  }

  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, name, user_tags, role',
      [role, userId]
    );
    if (result.rowCount === 0) {
      return sendError(ctx, 404, 'User not found');
    }
    ctx.status = 200;
    ctx.body = result.rows[0];
  } catch (err) {
    sendError(ctx, 500, 'Internal server error', err);
  }
}
