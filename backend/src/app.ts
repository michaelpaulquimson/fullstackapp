import Koa from 'koa';
import Router from '@koa/router';
import type { Context } from 'koa';

const app = new Koa();
const router = new Router();

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
