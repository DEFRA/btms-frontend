import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { config } from '~/src/config/config.js'
import { mediumDateTime } from '~/src/server/common/helpers/format-date-time.js'
import axios from 'axios'

const viewHistoryController = {
  handler: async (request, h) => {
    const logger = createLogger()
    const requested = {
      params: request.params,
      query: request.query,
      form: request.form
    }
    const auth = Buffer.from(config.get('coreBackend.apiUsername') + ':' + config.get('coreBackend.apiPassword')).toString('base64')

    logger.info(`View history received request: ${JSON.stringify(requested)}`)

    const backendApi = config.get('coreBackend.apiUrl')
    const authedUser = await request.getUserSession()
    let url = `${backendApi}/analytics/timeline?movementId=${request.query.mrn}`

    logger.info(`Making API call to ${url}`)

    const historyResponse = await axios.get(url, {
      headers: {
        Authorization: 'Basic ' + auth
      }
    })

    const history = historyResponse.data.items.map((entry) => [
      { kind: 'text', value: entry.auditEntry.createdBy },
      { kind: 'text', value: entry.auditEntry.status },
      { kind: 'text', value: entry.resourceType },
      // { kind: 'text', value: entry.resourceId },
      { kind: 'link',
        newWindow: true,
        url: `/auth/proxy/api/${entry.resourceApiPrefix}/${entry.resourceId}`,
        value: entry.resourceId
      },
      { kind: 'text', value: entry.auditEntry.version },
      {
        kind: 'text',
        value: mediumDateTime(entry.auditEntry.createdSource)
      },
      // { kind: 'text', value: mediumDateTime(entry.auditEntry.createdLocal) }

    ])

    url = `${backendApi}/api/movements/${request.query.mrn}`

    logger.info(`Making API call to ${url}`)

    const movementResponse = await axios.get(url, {
      headers: {
        Authorization: 'Basic ' + auth
      }
    })

    // TODO - may want to switch to the json-api-dotnet client we used in TDM
    let checks = movementResponse.data.data.attributes.alvsDecisions.map((decision) =>
      decision.checks.map((check) =>
      {
        return {check: check, context: decision.context, created: decision.decision.serviceHeader.serviceCalled}
      }
      )
    )
    .flat()
    .sort((a, b) => a.created < b.created ? -1 : 1)

    checks = checks
    .map((item) => [
      { kind: 'text', value: item.check.itemNumber },
      { kind: 'text', value: item.check.checkCode },
      { kind: 'text', value: 'TODO' },
      { kind: 'text', value: item.check.btmsDecisionCode },
      { kind: 'text', value: item.context.btmsDecisionNumber },
      { kind: 'text', value: item.check.alvsDecisionCode },
      { kind: 'text', value: item.context.alvsDecisionNumber },
      { kind: 'text', value: mediumDateTime(item.created) }
    ])

    return h.view('admin/view-history', {
      pageTitle: 'Admin',
      heading: 'Admin',
      breadcrumbs: [
        {
          text: 'Home',
          href: '/'
        },
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Mrn History',
          href: '/admin'
        },
        {
          text: request.query.mrn,
          href: `/auth/proxy/api/movements/${request.query.mrn}`
        }
      ],
      history,
      mrn:request.query.mrn,
      checks
    })
  }
}

export { viewHistoryController }
