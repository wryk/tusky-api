# tusky-api

WIP prototype nodejs implementation of the next mqtt based tusky push notification api

you can use npm script options with `npm run command -- --option value`

## Running
```sh
npm run server -- --api-port 8080 --mqtt-port 1883 --mqtt-websocket-port 8000
```

## REST API
* `POST /` create session
* `DELETE /` delete session

## Stream reader
Usefull resources :
* mastodon streaming api documentation : https://github.com/tootsuite/documentation/blob/master/Using-the-API/Streaming-API.md
* mastodon access token generator : https://takahashim.github.io/mastodon-access-token/

SSE servers:
* demo : https://sse.now.sh
* mastodon : https://mastodon.social/api/v1/streaming?stream=user&accessToken=token


### EventSource
```sh
# test EventSource reader with a demo SSE server
npm run reader-es -- --url https://sse.now.sh
```

### WebSocket
```sh
# test WebSocket reader with a demo SSE server
npm run reader-ws -- --url https://sse.now.sh
```
