/**
 * A GDS styled example about page controller.
 * Provided as an example, remove or modify as required.
 * @satisfies {Partial<ServerRoute>}
 */
import axios from 'axios'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { number } from '~/src/server/common/helpers/format-number.js'
import { config } from '~/src/config/config.js'
import { mediumDateTime } from '../common/helpers/format-date-time.js'

export const decisionsController = {
  async handler(request, h) {
    const logger = createLogger()
    const requested = {
      params: request.params,
      query: request.query,
      form: request.form
    }
    logger.info(`Decisions received request: ${JSON.stringify(requested)}`)

    // Some temporary setup whilst we're trying to test a week of November data
    let chedType = requested.query.chedType || "Cveda"
    let coo = requested.query.coo || "FR"
    let dateFrom = requested.query.dateFrom || "2024-11-18"
    let dateTo = requested.query.dateTo || "2024-11-25"
    let minDate = "2023-01-01"
    let maxDate = new Date().toISOString().slice(0,10)

    const backendApi = config.get('coreBackend.apiUrl')
    const authedUser = await request.getUserSession()
    const chedFilter = coo == "All" ? "" : `chedType=${chedType}&`
    const cooFilter = coo == "All" ? "" : `coo=${coo}&`
    const qs = `${chedFilter}${cooFilter}dateFrom=${dateFrom}&dateTo=${dateTo}`
    const url = `${backendApi}/analytics/dashboard?chartsToRender=decisionsByDecisionCode&${qs}`

    logger.info(`Making API call to ${url}`)

    const decisionResponse = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${authedUser.jwt}`
      }
    })

    const exceptionUrl = `${backendApi}/analytics/exceptions?${qs}`

    logger.info(`Making API call to ${exceptionUrl}`)

    const exceptionResponse = await axios.get(exceptionUrl, {
      headers: {
        Authorization: `Bearer ${authedUser.jwt}`
      }
    })

    const decisions = decisionResponse.data
      .decisionsByDecisionCode.result
      .map((row) =>
      [
        { kind: 'text', value: row.fields.CheckCode },
        { kind: 'text', value: row.fields.AlvsDecisionCode },
        { kind: 'text', value: row.fields.BtmsDecisionCode },
        { kind: 'text', value: row.value },
        { kind: 'text', value: row.fields.Classification }
      ])
        // .concat(row.columns.map((c) =>
        //   ({ kind: 'text', value: number(c.value) }))))

    const exceptions = exceptionResponse.data.map((row) =>
      [{ kind: 'link',
        url: `/admin/view-history?mrn=${row.id}`,
        value: row.id
      },
      { kind: 'text', value: row.itemCount },
      { kind: 'text', value: row.maxEntryVersion },
      { kind: 'text', value: row.maxDecisionNumber },
      { kind: 'text', value: row.linkedCheds },
      { kind: 'text', value: '' },
      { kind: 'text', value: mediumDateTime(row.updatedSource) },
      { kind: 'text', value: row.reason }]
    )

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
      decisions,
      exceptions,
      dateFrom,
      dateTo,
      minDate,
      maxDate,
      chedType,
      coo,
      analyticsFilter: qs
    })
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
