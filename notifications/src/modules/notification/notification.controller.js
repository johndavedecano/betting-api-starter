import NotificationRepo from 'repos/notification-repo'

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
    const notifications = await NotificationRepo.listByUser(
      req.params.user_id,
      req.query
    )
    return res.json({ notifications })
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
    const notification = await NotificationRepo.find(req.params.id)
    return res.json({ notification })
  } catch (error) {
    return next(error)
  }
}

/**
 * Create a notification
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function create(req, res, next) {
  try {
    const notification = await NotificationRepo.create(req.body)
    return res.json({ notification })
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
    const notification = await NotificationRepo.find(req.params.id)
    return res.json({ notification, params: req.params })
  } catch (error) {
    return next(error)
  }
}

/**
 * Update seen
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function updateSeen(req, res, next) {
  try {
    const notification = await NotificationRepo.update(req.params.id, {
      is_seen: true
    })
    return res.json({ notification })
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
    const notification = await NotificationRepo.destroy(req.params.id)
    return res.json({ notification })
  } catch (error) {
    return next(error)
  }
}

export default { index, find, create, update, updateSeen, destroy }
