import Router from '@koa/router';
import { createUser, getAllUsers, updateUserRole } from '../controllers/userController';

const router = new Router({ prefix: '/users' });

// POST /users
router.post('/', createUser);
// GET /users
router.get('/', getAllUsers);
// PATCH /users/:id/role
router.patch('/:id/role', updateUserRole);

export default router;
