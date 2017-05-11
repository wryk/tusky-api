export function client (client) {
  return `Client(id="${client.id}")`
}

export function packet (packet) {
  return `Packet(topic="${packet.topic}" qos=${packet.qos} retain=${packet.qos} payload="${packet.paylod}")`
}
