import PlayerRepo from './../../repos/player-repo'

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
    const players = await PlayerRepo.list(req.query)
    return res.json({ players })
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
    const player = await PlayerRepo.find(req.params.id)
    return res.json({ player })
  } catch (error) {
    return next(error)
  }
}

/**
 * Create a player
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function create(req, res, next) {
  try {
    const player = await PlayerRepo.create({
      name: req.body.name,
      cover_url: req.body.cover_url,
      thumbnail_url: req.body.thumbnail_url
    })
    return res.json({ player })
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
    const player = await PlayerRepo.update(req.params.id, {
      name: req.body.name,
      cover_url: req.body.cover_url,
      thumbnail_url: req.body.thumbnail_url
    })
    return res.json({ player })
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
    const player = await PlayerRepo.destroy(req.params.id)
    return res.json({ player })
  } catch (error) {
    return next(error)
  }
}

export default { index, find, create, update, destroy }
