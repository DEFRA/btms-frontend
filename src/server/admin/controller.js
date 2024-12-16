import { config } from '~/src/config/config.js'

const homeController = {
  handler: (request, h) => {
    const conf = JSON.parse(config.toString())
    // logger.info(c)

    return h.view('admin/index', {
      pageTitle: 'Admin',
      heading: 'Admin',
      manageAccountUrl: config.get('defraId.manageAccountUrl'),
      config: conf
    })
  }
}

export { homeController }
