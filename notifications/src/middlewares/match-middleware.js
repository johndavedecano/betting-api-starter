import get from 'lodash/get'

import EventService from 'services/event-service'

export default async function(req, res, next) {
  try {
    const response = await EventService.findMatch(req.body.match_id)

    const match = get(response, 'data.match')

    req.match = match

    next()
  } catch (error) {
    next(error)
  }
}
