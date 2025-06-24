import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import userRoutes from './routes/userRoutes';
import userTagRoutes from './routes/userTagRoutes';
import type { Context } from 'koa';

const app = new Koa();
const router = new Router();

app.use(bodyParser());

// Logging middleware for all API calls (after bodyParser)
app.use(async (ctx, next) => {
  console.log(`[API] ${ctx.method} ${ctx.url} - received:`, ctx.request.body);
  await next();
  console.log(`[API] ${ctx.method} ${ctx.url} - response:`, ctx.status, ctx.body);
});

app.use(userRoutes.routes());
app.use(userTagRoutes.routes());

router.get('/', async (ctx: Context) => {
  ctx.body = 'Hello World from Koa + TypeScript!';
});

app
  .use(router.routes())
  .use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Koa server running on http://localhost:${PORT}`);
});
