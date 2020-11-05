const Router = require('koa-router');
const History = require('./model');
const { auth, authz, cache } = require('../../../middleware');

const router = new Router({
  prefix: '/history',
});

// Get all history events
router.get('/', cache(300), async (ctx) => {
  try {
    const result = await History.find({});
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Get one history event
router.get('/:id', cache(300), async (ctx) => {
  const result = await History.findById(ctx.params.id);
  if (!result) {
    ctx.throw(404);
  }
  ctx.status = 200;
  ctx.body = result;
});

// Query history events
router.post('/query', cache(300), async (ctx) => {
  const { query = {}, options = {} } = ctx.request.body;
  try {
    const result = await History.paginate(query, options);
    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Create a history event
router.post('/', auth, authz, async (ctx) => {
  try {
    const history = new History(ctx.request.body);
    await history.save();
    ctx.status = 201;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Update a history event
router.patch('/:id', auth, authz, async (ctx) => {
  try {
    await History.findByIdAndUpdate(ctx.params.id, ctx.request.body, { runValidators: true });
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

// Delete history event
router.delete('/:id', auth, authz, async (ctx) => {
  try {
    await History.findByIdAndDelete(ctx.params.id);
    ctx.status = 200;
  } catch (error) {
    ctx.throw(400, error.message);
  }
});

module.exports = router;
