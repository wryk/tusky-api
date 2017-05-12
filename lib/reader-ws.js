import yargs from 'yargs'
import WebSocket from 'ws'

const argv = yargs
  .usage('Usage: $0 --url [string=https://sse.now.sh]')
  .default({
    url: 'https://sse.now.sh/'
  })
  .argv

const { url } = argv

const ws = new WebSocket(url)

ws.on('open', () => console.log('open', ws.readyState))
ws.on('message', data => console.log('message', data))
ws.on('error', error => console.log('error', error))
ws.on('close', code => console.log('close', code))
