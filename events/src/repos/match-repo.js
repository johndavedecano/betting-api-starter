import get from 'lodash/get'
import isUndefined from 'lodash/isUndefined'
import { ModelNotFound, InvalidArgumentException } from './../helpers/api-error'

import MatchModel from './../models/match-model'
import CategoryRepo from './../repos/category-repo'
import OddModel from './../models/odd-model'
import PlayerModel from './../models/player-model'
import { PLAYING } from '../constants'

async function updateOdd(id, odd_id, params) {
  await OddModel.findByIdAndUpdate({ _id: odd_id }, params)
  return await this.find(id)
}

async function addWinner(id, odd_id) {
  await OddModel.findByIdAndUpdate(
    { _id: odd_id, is_closed: false },
    { is_winner: true, is_closed: true }
  )

  return await this.find(id)
}

async function addOdd(id, params) {
  const match = await this.find(id)
  const odd = new OddModel(params)

  await odd.save()

  match.odds.push(odd)

  await match.save()

  return match
}

async function removeOdd(id, odd_id) {
  const match = await this.find(id)

  match.odds = match.odds.filter(mp => {
    return String(mp._id) !== String(odd_id)
  })

  await match.save()

  return match
}

async function addPlayer(id, params) {
  const match = await this.find(id)
  const player = new PlayerModel(params)

  await player.save()

  match.players.push(player)

  await match.save()

  return match
}

async function updatePlayer(id, player_id, params) {
  await PlayerModel.findByIdAndUpdate({ _id: player_id }, params)
  return await this.find(id)
}

async function removePlayer(id, player_id) {
  const match = await this.find(id)

  match.players = match.players.filter(mp => {
    return String(mp._id) !== String(player_id)
  })

  await match.save()

  return match
}

/**
 * List and paginate documents
 *
 * @param {*} params
 *
 * @returns {Promise}
 */
async function list(params = { page: 1, limit: 15 }) {
  const limit = get(params, 'limit', 15)
  const page = get(params, 'page', 1)

  return await MatchModel.paginate(
    {},
    {
      limit,
      page,
      populate: ['category', 'odds', 'players']
    }
  )
}

/**
 * Find a document
 *
 * @param {String} _id
 *
 * @returns {Promise}
 */
async function find(_id) {
  try {
    const model = await MatchModel.findById({ _id })
      .populate('category')
      .populate('odds')
      .populate('players')

    if (!model) throw new Error('Value is null')

    return model
  } catch (err) {
    throw new ModelNotFound('Model not found')
  }
}

/**
 * Create a document
 *
 * @param {Object} params
 *
 * @returns {Promise}
 */
async function create(params) {
  const category = await CategoryRepo.find(params.category_id)

  const match = await MatchModel.create({
    category: category._id,
    name: params.name,
    description: params.description,
    cover_url: params.cover_url,
    thumbnail_url: params.thumbnail_url,
    media_url: params.media_url,
    starts_at: params.starts_at
  })

  return await this.find(match._id)
}

/**
 * Update a document
 *
 * @param {String} id
 * @param {Object} params
 *
 * @returns {Promise}
 */
async function update(id, params, check = false) {
  const match = await this.find(id)

  Object.keys(params).forEach(key => {
    if (!isUndefined(params[key])) {
      match[key] = params[key]
    }
  })

  return await match.save()
}

/**
 * Update a document status
 *
 * @param {String} id
 * @param {Strinng} status
 *
 * @returns {Promise}
 */
async function updateStatus(id, status = 'PENDING') {
  const match = await this.find(id)

  if (PLAYING === status && match.players.length < 2) {
    throw new InvalidArgumentException(
      'Match cannot start without enough players'
    )
  }

  match.status = status

  return await match.save()
}

/**
 * Delete a document
 *
 * @param {*} id
 *
 * @returns {Promise}
 */
async function destroy(id) {
  const match = await this.find(id)

  return await match.remove()
}

export default {
  list,
  find,
  create,
  update,
  destroy,
  updateStatus,
  addPlayer,
  updatePlayer,
  removePlayer,
  addOdd,
  removeOdd,
  updateOdd,
  addWinner
}
