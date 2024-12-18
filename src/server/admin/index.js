import { homeController } from '~/src/server/admin/controller.js'
import { syncController } from '~/src/server/admin/sync.js'
import { clearController } from '~/src/server/admin/clear.js'
import { viewHistoryController } from '~/src/server/admin/viewHistory.js'

const admin = {
  plugin: {
    name: 'admin',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/admin',
          options: {
            auth: { mode: 'try' }
          },
          ...homeController
        },
        {
          method: 'GET',
          path: '/admin/sync',
          ...syncController
        },
        {
          method: 'POST',
          path: '/admin/clear-db',
          ...clearController
        },
        {
          method: 'GET',
          path: '/admin/view-history',
          ...viewHistoryController,
          options: {
            auth: { mode: 'try' }
          },
        }
      ])
    }
  }
}

export { admin }
