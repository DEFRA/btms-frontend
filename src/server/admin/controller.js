import { config } from '~/src/config/config.js'
import { createLogger } from "~/src/server/common/helpers/logging/logger.js";

const logger = createLogger()

const homeController = {
  handler: (request, h) => {

    var c = JSON.parse(config.toString())
    // logger.info(c)

    return h.view('admin/index', {
      pageTitle: 'Admin',
      heading: 'Admin',
      manageAccountUrl: config.get('defraId.manageAccountUrl'),
      config: c
    })
  }
}

export { homeController }
