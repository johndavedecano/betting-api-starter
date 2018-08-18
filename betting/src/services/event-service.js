import HttpClient from 'helpers/create-http-client'
import createAdminToken from 'helpers/create-admin-token'
import handleErrorResponse from 'helpers/response-error'
import config from 'config/config'

const request = HttpClient(
  { baseURL: config.events_url },
  { Authorization: `Bearer ${createAdminToken()}` }
)

async function getMatches(params) {
  try {
    return await request.get('/api/matches', params)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

async function createMatch(params = {}) {
  try {
    return await request.post('/api/matches', params)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

async function updateMatch(matchId, params = {}) {
  try {
    return await request.put(`/api/matches/${matchId}`, params)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

async function destroyMatch(matchId) {
  try {
    return await request.delete(`/api/matches/${matchId}`)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

async function findMatch(matchId) {
  try {
    return await request.get(`/api/matches/${matchId}`)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

async function openBetting(matchId) {
  try {
    return await request.put(`/api/matches/${matchId}/betting-status`)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

async function closeBetting(matchId) {
  try {
    return await request.delete(`/api/matches/${matchId}/betting-status`)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

async function updateMatchStatus(matchId, params = {}) {
  try {
    return await request.put(`/api/matches/${matchId}/match-status`, params)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

async function getMatchPlayers(matchId) {
  try {
    return await request.get(`/api/matches/${matchId}/players`)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

async function addMatchPlayer(matchId, params) {
  try {
    return await request.post(`/api/matches/${matchId}/players`, params)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

async function updateMatchPlayer(matchId, params) {
  try {
    return await request.put(`/api/matches/${matchId}/players`, params)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

async function deleteMatchPlayer(matchId, params) {
  try {
    return await request.delete(`/api/matches/${matchId}/players`, params)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

export default {
  getMatches,
  createMatch,
  updateMatch,
  destroyMatch,
  findMatch,
  openBetting,
  closeBetting,
  updateMatchStatus,
  getMatchPlayers,
  addMatchPlayer,
  updateMatchPlayer,
  deleteMatchPlayer
}
