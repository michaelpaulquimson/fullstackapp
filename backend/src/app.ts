import dotenv from 'dotenv';
dotenv.config();
import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import userRoutes from './routes/userRoutes';
import userTagRoutes from './routes/userTagRoutes';
import type { Context } from 'koa';

// Fancy env loader log (excluding password)
const loadedEnv = Object.fromEntries(
  Object.entries(process.env).filter(
    ([key]) =>
      !key.toLowerCase().includes('password') &&
      !key.startsWith('npm_') &&
      !key.startsWith('NODE_') &&
      !['PATH', 'PWD', 'HOME'].includes(key)
  )
);
console.log('\n==============================');
console.log(' Loaded Environment Variables ');
console.log('==============================');
Object.entries(loadedEnv).forEach(([key, value]) => {
  console.log(`- ${key}: ${value}`);
});
console.log('==============================\n');

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
  console.log('\n===========================================');
  console.log(` 🚀 Koa server is up and running!`);
  console.log(` 🌐 Listening at: http://localhost:${PORT}`);
  console.log('===========================================\n');
});
