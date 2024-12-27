import {
  createAll,
  Button,
  Checkboxes,
  ErrorSummary,
  Header,
  Radios,
  SkipLink,
  Accordion
} from 'govuk-frontend'

import { setup } from './admin-dashboard.js'

createAll(Button)
createAll(Checkboxes)
createAll(ErrorSummary)
createAll(Header)
createAll(Radios)
createAll(SkipLink)
createAll(Accordion)


// TBC : Not too sure how to make the analytics setup function available
// so that it can be loaded only on analytics pages...

window["analytics"] = setup
