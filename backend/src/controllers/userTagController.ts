import { Context } from 'koa';
import pool from '../config/db';
import { sendError } from '../helpers/utils';

// POST /user-tags
export async function createUserTag(ctx: Context) {
    const { tag } = ctx.request.body as { tag: string };

    if (!tag || typeof tag !== 'string' || tag.trim() === '') {
        return sendError(ctx, 400, 'tag (string) is required');
    }
    try {
        // Check if tag already exists
        const existing = await pool.query('SELECT id FROM tags WHERE tag = $1', [tag]);
        if ((existing.rowCount ?? 0) > 0) {
            return sendError(ctx, 409, 'Tag already exists');
        }
        // Insert the new tag
        const result = await pool.query(
            'INSERT INTO tags (tag) VALUES ($1) RETURNING *',
            [tag]
        );
        ctx.status = 201;
        ctx.body = result.rows[0];
    } catch (err) {
        sendError(ctx, 500, 'Internal server error', err);
    }
}

// GET /user-tags
export async function getAllUserTags(ctx: Context) {
    try {
        const result = await pool.query('SELECT * FROM tags ORDER BY id');
        ctx.status = 200;
        ctx.body = result.rows;
    } catch (err) {
        sendError(ctx, 500, 'Internal server error', err);
    }
}
