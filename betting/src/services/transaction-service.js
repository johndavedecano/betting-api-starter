import HttpClient from 'helpers/create-http-client'
import createAdminToken from 'helpers/create-admin-token'
import handleErrorResponse from 'helpers/response-error'
import config from 'config/config'

const request = HttpClient(
  { baseURL: config.wallets_url },
  { Authorization: `Bearer ${createAdminToken()}` }
)

async function getTransactions(userId, params = {}) {
  try {
    return await request.get(`/api/transactions/${userId}`, params)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

async function createTransaction(userId, params = {}) {
  try {
    return await request.post(`/api/transactions/${userId}`, params)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

async function updateTransaction(userId, transactionId, params = {}) {
  try {
    return await request.put(
      `/api/transactions/${userId}/${transactionId}`,
      params
    )
  } catch (error) {
    return handleErrorResponse(error)
  }
}

async function destroyTransaction(userId, transactionId) {
  try {
    return await request.delete(`/api/transactions/${userId}/${transactionId}`)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

async function findTransaction(userId, transactionId) {
  try {
    return await request.get(`/api/transactions/${userId}/${transactionId}`)
  } catch (error) {
    return handleErrorResponse(error)
  }
}

export default {
  getTransactions,
  createTransaction,
  updateTransaction,
  destroyTransaction,
  findTransaction
}
