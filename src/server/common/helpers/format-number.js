import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
const logger = createLogger()
function number(number) {
  logger.debug(`number : ${number}`)
  return number.toLocaleString('en-GB')
}

export { number }
