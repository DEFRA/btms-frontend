/**
 * A GDS styled example about page controller.
 * Provided as an example, remove or modify as required.
 * @satisfies {Partial<ServerRoute>}
 */
import axios from 'axios'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { config } from '~/src/config/config.js'

export const decisionsController = {
  async handler(request, h) {
    const logger = createLogger()

    const backendApi = config.get('coreBackend.apiUrl')
    const authedUser = await request.getUserSession()
    const url = `${backendApi}/analytics/dashboard?chartsToRender=lastMonthsDecisionsByDecisionCode`

    logger.info(`Making API call to ${url}`)

    const decisionResponse = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${authedUser.jwt}`
      }
    })

    const decisions = decisionResponse.data.lastMonthsDecisionsByDecisionCode.rows.map((row) =>
      [{ kind: 'text', value: row.key }]
        .concat(row.columns.map((c) =>
          ({ kind: 'text', value: c.value }))))

    return h.view('analytics/decisions', {
      pageTitle: 'Decisions',
      heading: 'Decisions',
      breadcrumbs: [
        {
          text: 'Home',
          href: '/'
        },
        {
          text: 'Analytics'
        }
      ],
      decisions
    })
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
