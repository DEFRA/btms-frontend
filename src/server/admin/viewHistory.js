import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { config } from '~/src/config/config.js'
import { mediumDateTime } from '~/src/server/common/helpers/date-time.js'
import axios from 'axios'
// import {data} from "autoprefixer";

const viewHistoryController = {
  handler: async (request, h) => {
    const logger = createLogger()
    const requested = {
      params: request.params,
      query: request.query,
      form: request.form
    }
    logger.info(`View history received request: ${JSON.stringify(requested)}`)

    const backendApi = config.get('coreBackend.apiUrl')
    const authedUser = await request.getUserSession()
    const url = `${backendApi}/analytics/timeline?movementId=${request.query.mrn}`

    logger.info(`Making API call to ${url}`)

    const historyResponse = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${authedUser.jwt}`
      }
    })

    const history = historyResponse.data.items.map((entry) => [
      { kind: 'text', value: entry.auditEntry.createdBy },
      { kind: 'text', value: entry.auditEntry.status },
      { kind: 'text', value: entry.resourceType },
      { kind: 'text', value: entry.resourceId },
      { kind: 'text', value: entry.auditEntry.version },
      {
        kind: 'text',
        value: mediumDateTime(entry.auditEntry.createdSource)
      },
      // { kind: 'text', value: mediumDateTime(entry.auditEntry.createdLocal) }

    ])

    return h.view('admin/view-history', {
      pageTitle: 'Admin',
      heading: 'Admin',
      manageAccountUrl: config.get('defraId.manageAccountUrl'),
      history,
      mrn:request.query.mrn
    })
  }
}

export { viewHistoryController }
