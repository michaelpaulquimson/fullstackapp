import Router from '@koa/router';
import { createUserTag, getAllUserTags } from '../controllers/userTagController';

const router = new Router({ prefix: '/user-tags' });

// POST /user-tags
router.post('/', createUserTag);
// GET /user-tags
router.get('/', getAllUserTags);

export default router;
