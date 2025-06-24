import { Context } from 'koa';
import pool from '../config/db';

// POST /user-tags
export async function createUserTag(ctx: Context) {
    const { tag } = ctx.request.body as { tag: string };

    if (!tag || typeof tag !== 'string' || tag.trim() === '') {
        ctx.status = 400;
        ctx.body = { error: 'tag (string) is required' };
        return;
    }
    try {
        // Check if tag already exists
        const existing = await pool.query('SELECT id FROM user_tags WHERE $1 = ANY(user_tags.tag)', [tag]);
        if ((existing.rowCount ?? 0) > 0) {
            ctx.status = 409;
            ctx.body = { error: 'Tag already exists' };
            return;
        }
        // Insert the new tag as a single-element array
        const result = await pool.query(
            'INSERT INTO user_tags (user_tags.tag) VALUES ($1) RETURNING *',
            [[tag]]
        );
        ctx.status = 201;
        ctx.body = result.rows[0];
    } catch (err: any) {
        ctx.status = 500;
        ctx.body = { error: 'Internal server error' };
    }
}

// GET /user-tags
export async function getAllUserTags(ctx: Context) {
    try {
        const result = await pool.query('SELECT * FROM user_tags ORDER BY id');
        ctx.status = 200;
        ctx.body = result.rows;
    } catch (err: any) {
        ctx.status = 500;
        ctx.body = { error: 'Internal server error' };
    }
}
