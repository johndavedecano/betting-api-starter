import CategoryRepo from './../../repos/category-repo'

/**
 * List and paginate resources
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function index(req, res, next) {
  try {
    const categories = await CategoryRepo.list(req.query)
    return res.json({ categories })
  } catch (error) {
    return next(error)
  }
}

/**
 * Show a resource
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function find(req, res, next) {
  try {
    const category = await CategoryRepo.find(req.params.id)
    return res.json({ category })
  } catch (error) {
    return next(error)
  }
}

/**
 * Create a category
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function create(req, res, next) {
  try {
    const category = await CategoryRepo.create({
      name: req.body.name,
      cover_url: req.body.cover_url,
      thumbnail_url: req.body.thumbnail_url
    })
    return res.json({ category })
  } catch (error) {
    return next(error)
  }
}

/**
 * Update a resource
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function update(req, res, next) {
  try {
    const category = await CategoryRepo.update(req.params.id, {
      name: req.body.name,
      cover_url: req.body.cover_url,
      thumbnail_url: req.body.thumbnail_url
    })
    return res.json({ category })
  } catch (error) {
    return next(error)
  }
}

/**
 * Delete a resource
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function destroy(req, res, next) {
  try {
    const category = await CategoryRepo.destroy(req.params.id)
    return res.json({ category })
  } catch (error) {
    return next(error)
  }
}

export default { index, find, create, update, destroy }
