# tusky-api

WIP prototype nodejs implementation of the next mqtt based tusky push notification api

## Running
* Redis is required for session storage, and broker emitter/persistence.
* tusky-api optionally supports [uWebSockets/uWebSockets](https://github.com/uNetworking/uWebSockets) when available (`npm install uws` to use it) and fallback to [websockets/ws](https://github.com/websockets/ws).

```sh
npm run server
```

## How to use

### WebService
* `POST /register` { instanceUrl, accessToken, deviceToken }
* `POST /unregister` { instanceUrl, accessToken, deviceToken }

### MQTT Broker
Client ID need to be the deviceToken used when registration with the web service.
Without a registered deviceToken, authentication will be rejected.
Authenticated clients can only access their `INSTANCE_URL/ACCESS_TOKEN/#` topic.

## Experiments
Resources about Mastodon streaming API :
* SSE streaming API documentation : https://github.com/tootsuite/documentation/blob/master/Using-the-API/Streaming-API.md
* access token generator : https://takahashim.github.io/mastodon-access-token/
* Streaming API (SSE and WS) implementation : https://github.com/tootsuite/mastodon/blob/master/streaming/index.js

### Listener
```sh
npm run listener -- <sse|ws> INSTANCE_URL ACCESS_TOKEN [--endpoint=<user|public>]
```

TODO: test listeners implementations against special use case (redirection etc)
