# tusky-api

WIP prototype nodejs implementation of the next mqtt based tusky push notification api

you can use npm script options with `npm run command -- --option value`

## Running
Actually only require sqlite3 (non persistant storage)

```sh
npm run server -- --api-port 8080 --broker-port 1883 --websocket-broker-port 8000
```

## How to use
### API
* `POST /register` create session
* `POST /unregister` delete session

### MQTT BROKER
WIP, actually it's just a barebone mqtt broker

## Stream reader
Usefull resources :
* Mastodon streaming api documentation (lmao) : https://github.com/tootsuite/documentation/blob/master/Using-the-API/Streaming-API.md
* Mastodon access token generator : https://takahashim.github.io/mastodon-access-token/

SSE servers:
* demo : https://sse.now.sh
* Mastodon (edit: not spec compliant :D) : https://mastodon.social/api/v1/streaming?stream=user&accessToken=token

### WebSocket
```sh
# test WebSocket reader with a demo SSE server
npm run reader-ws -- --url https://sse.now.sh
```


### EventSource
*Doesn't work with Mastodon because the streaming API isn't spec compliant*
```sh
# test EventSource reader with a demo SSE server
npm run reader-es -- --url https://sse.now.sh
```

## TODO
* [ ] use redis (or alternative) for broker emitter and persistance (and session storage ?)
* [ ] replace ws by a more lightweigth web socket implementation (uws ?)
