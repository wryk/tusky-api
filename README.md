# tusky-api

WIP prototype nodejs implementation of the next mqtt based tusky push notification api

## Running
Redis is required for session storage, and broker emitter/persistence.

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
Authenticated clients can only access their "INSTANCE_URL/ACCESS_TOKEN/#" topic.

## Stream reader
Usefull resources :
* Mastodon streaming api documentation (outdated or lmao) : https://github.com/tootsuite/documentation/blob/master/Using-the-API/Streaming-API.md
* Mastodon access token generator : https://takahashim.github.io/mastodon-access-token/

## TODO
* [ ] cleanup codebase
* [ ] use secure protocols (https and tls)
* [ ] add testing suite
* [ ] replace ws by a more lightweigth web socket implementation (uws ?)
