import { config } from '~/src/config/config.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import axios from 'axios'

export const serverVersion = {
  plugin: {
    name: 'server-version',
    register: async () => {
      // Get server version number
      const backendApi = config.get('coreBackend.apiUrl')
      const url = `${backendApi}/mgmt/status`
      //
      const logger = createLogger()

      logger.info(`Making backend status API call to ${url}`)

      const statusResponse = await axios.get(url)

      logger.info(
        `Backend status API response ${statusResponse.status} :  ${statusResponse.statusText}, version : ${statusResponse.data.version}`
      )

      if (statusResponse.data.version) {
        config.set('coreBackend.apiVersion', statusResponse.data.version)
      }
    }
  }
}
