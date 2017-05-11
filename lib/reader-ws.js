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

let heartbeat

ws.on('open', () => {
  console.log('open', ws.readyState)

  if (ws.readyState === 1) {
    heartbeat = setInterval(() => ws.ping(), 1000)
  }
})

ws.on('message', data => console.log('message', data))

ws.on('error', data => {
  console.log('error', data)

  clearInterval(heartbeat)
})

ws.on('close', code => {
  console.log('close', code)

  clearInterval(heartbeat)
})
