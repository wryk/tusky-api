import yargs from 'yargs'
import EventSource from 'eventsource'

const argv = yargs
  .usage('Usage: $0 --url [string=https://sse.now.sh]')
  .default({
    url: 'https://sse.now.sh/'
  })
  .argv

const { url } = argv

const es = new EventSource(url)

es.on('open', event => console.log('open', event))
es.on('message', event => console.log('message', event))
es.on('error', event => console.log('error', event))
