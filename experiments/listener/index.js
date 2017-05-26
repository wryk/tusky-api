import yargs from 'yargs'

import * as sse from './sse.js'
import * as ws from './ws.js'

export default yargs
  .command(sse)
  .command(ws)
  .help()
  .argv
