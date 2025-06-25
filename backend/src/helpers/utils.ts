import { Context } from 'koa';

export function sendError(ctx: Context, status: number, message: string, error?: unknown) {
  if (error) {
    console.error(message, error);
  }
  ctx.status = status;
  ctx.body = { error: message };
}
