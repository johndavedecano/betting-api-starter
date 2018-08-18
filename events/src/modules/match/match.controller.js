import MatchRepo from './../../repos/match-repo'
import publish from './../../helpers/publish'

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
    const matches = await MatchRepo.list(req.query)
    return res.json({ matches })
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
    const match = await MatchRepo.find(req.params.id)
    return res.json({ match })
  } catch (error) {
    return next(error)
  }
}

/**
 * Create a match
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function create(req, res, next) {
  try {
    const match = await MatchRepo.create({
      category_id: req.body.category_id,
      name: req.body.name,
      description: req.body.description,
      cover_url: req.body.cover_url,
      thumbnail_url: req.body.thumbnail_url,
      media_url: req.body.media_url,
      starts_at: req.body.starts_at
    })

    publish('MATCHES', 'MATCH:EVENTS', 'MATCH:CREATED', match)

    return res.json({ match })
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
    const match = await MatchRepo.update(req.params.id, {
      category_id: req.body.category_id,
      name: req.body.name,
      description: req.body.description,
      cover_url: req.body.cover_url,
      thumbnail_url: req.body.thumbnail_url,
      media_url: req.body.media_url,
      starts_at: req.body.starts_at,
      is_streaming: req.body.is_streaming
    })

    publish('MATCHES', 'MATCH:EVENTS', 'MATCH:UPDATED', match)

    return res.json({ match })
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
    const match = await MatchRepo.destroy(req.params.id)

    publish('MATCHES', 'MATCH:EVENTS', 'MATCH:DESTROYED', {
      _id: req.params.id
    })

    return res.json({ match })
  } catch (error) {
    return next(error)
  }
}

/**
 * Update betting status to open
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function bettingStatusOpen(req, res, next) {
  try {
    const match = await MatchRepo.update(req.params.id, {
      is_open: true
    })

    publish('MATCHES', 'MATCH:EVENTS', 'MATCH:UPDATED', match)

    return res.json({ match })
  } catch (error) {
    return next(error)
  }
}

/**
 * Update betting status to close
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function bettingStatusClose(req, res, next) {
  try {
    const match = await MatchRepo.update(req.params.id, {
      is_open: false
    })

    publish('MATCHES', 'MATCH:EVENTS', 'MATCH:UPDATED', match)

    return res.json({ match })
  } catch (error) {
    return next(error)
  }
}

/**
 * Updates match status to PENDING, PLAYING, STOPPED, FINISHED
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function matchStatus(req, res, next) {
  try {
    const match = await MatchRepo.updateStatus(req.params.id, req.body.status)

    publish('MATCHES', 'MATCH:EVENTS', 'MATCH:UPDATED', match)

    return res.json({ match })
  } catch (error) {
    return next(error)
  }
}

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function addPlayer(req, res, next) {
  try {
    const match = await MatchRepo.addPlayer(req.params.id, {
      name: req.body.name,
      cover_url: req.body.cover_url,
      thumbnail_url: req.body.thumbnail_url,
      is_winner: false,
      score: 0
    })

    publish('MATCHES', 'MATCH:EVENTS', 'MATCH:UPDATED', match)

    return res.json({ match })
  } catch (error) {
    return next(error)
  }
}

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function removePlayer(req, res, next) {
  try {
    const match = await MatchRepo.removePlayer(
      req.params.id,
      req.params.player_id
    )

    publish('MATCHES', 'MATCH:EVENTS', 'MATCH:UPDATED', match)

    return res.json({ match })
  } catch (error) {
    return next(error)
  }
}

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function updatePlayer(req, res, next) {
  try {
    const match = await MatchRepo.updatePlayer(
      req.params.id,
      req.params.player_id,
      {
        name: req.body.name,
        cover_url: req.body.cover_url,
        thumbnail_url: req.body.thumbnail_url,
        is_winner: req.body.is_winner,
        score: req.body.score
      }
    )

    publish('MATCHES', 'MATCH:EVENTS', 'MATCH:UPDATED', match)

    return res.json({ match })
  } catch (error) {
    return next(error)
  }
}

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function addOdd(req, res, next) {
  try {
    const match = await MatchRepo.addOdd(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      value: req.body.value,
      cover_url: req.body.cover_url,
      thumbnail_url: req.body.thumbnail_url
    })

    publish('MATCHES', 'MATCH:EVENTS', 'MATCH:UPDATED', match)

    return res.json({ match })
  } catch (error) {
    return next(error)
  }
}

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function updateOdd(req, res, next) {
  try {
    const match = await MatchRepo.updateOdd(req.params.id, req.params.odd_id, {
      name: req.body.name,
      description: req.body.description,
      value: req.body.value,
      cover_url: req.body.cover_url,
      thumbnail_url: req.body.thumbnail_url
    })

    publish('MATCHES', 'MATCH:EVENTS', 'MATCH:UPDATED', match)

    return res.json({ match })
  } catch (error) {
    return next(error)
  }
}

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function removeOdd(req, res, next) {
  try {
    const match = await MatchRepo.removeOdd(req.params.id, req.params.odd_id)

    publish('MATCHES', 'MATCH:EVENTS', 'MATCH:UPDATED', match)

    return res.json({ match })
  } catch (error) {
    return next(error)
  }
}

/**
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns {Promise}
 */
async function addWinner(req, res, next) {
  try {
    const match = await MatchRepo.addWinner(req.params.id, req.params.odd_id)

    publish('MATCHES', 'MATCH:EVENTS', 'MATCH:UPDATED', match)

    return res.json({ match })
  } catch (error) {
    return next(error)
  }
}

export default {
  index,
  find,
  create,
  update,
  destroy,
  matchStatus,
  bettingStatusClose,
  bettingStatusOpen,
  addPlayer,
  removePlayer,
  updatePlayer,
  addOdd,
  removeOdd,
  updateOdd,
  addWinner
}
