import { analyticsController } from '~/src/server/analytics/controller.js'
import { decisionsController } from '~/src/server/analytics/decisions.js'

/**
 * Sets up the routes used in the /about page.
 * These routes are registered in src/server/router.js.
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const analytics = {
  plugin: {
    name: 'analytics',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/analytics',
          options: {
            auth: { mode: 'try' }
          },
          ...analyticsController
        },
        {
          method: 'GET',
          path: '/analytics/decisions',
          options: {
            auth: { mode: 'try' }
          },
          ...decisionsController
        }
      ])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
