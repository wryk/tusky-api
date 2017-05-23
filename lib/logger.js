import winston from 'winston'

const logger = new winston.Logger({
  level: 'silly',
  transports: [new winston.transports.Console()]
})

export default logger
