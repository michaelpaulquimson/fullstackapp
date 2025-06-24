import Router from '@koa/router';
import { createUser, getAllUsers } from '../controllers/userController';

const router = new Router({ prefix: '/users' });

// POST /users
router.post('/', createUser);
// GET /users
router.get('/', getAllUsers);

export default router;
