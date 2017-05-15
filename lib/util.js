export function id ({ instanceUrl, accessToken }) {
  return `${instanceUrl}:${accessToken}`
}

export function topic ({ instanceUrl, accessToken }) {
  return `${instanceUrl}/${accessToken}/#`
}

export function url ({ instanceUrl, accessToken }) {
  return `https://${instanceUrl}/api/v1/streaming?stream=user&access_token=${accessToken}`
}
